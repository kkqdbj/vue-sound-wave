import {soundWaveBarProps} from '../../index'
import { getBarColor} from '../utils/color'
import { processData,getBounding,getBricksList,getCapBounding,getHorizonHeightAndVerticalHeight } from '../utils/bounding'

export function useBar(){
    let capList:number[] = [];
    let lastDataArray:Uint8Array = new Uint8Array();

    // getCapBounding(capList[i],setting.capsHeight,canvas.width,canvas.height,setting.barDirection)

    const draw = (
        canvas:HTMLCanvasElement,
        dataArray:Uint8Array,
        setting:Required<soundWaveBarProps>,
        isEnd:boolean
    ):boolean => {
        const ctx = canvas.getContext('2d')
        if (!ctx) return false
        
        // 清空画布
        ctx.fillStyle = setting.backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // 保存当前数据用于音频结束时的降落效果
        if (!isEnd && dataArray.length > 0) {
            lastDataArray = new Uint8Array(dataArray);
        }
        
        const currentDataArray = processData(isEnd ? lastDataArray : dataArray,setting.barDataSort);

        const {horizonHeight,verticalHeight} = getHorizonHeightAndVerticalHeight(setting.barDirection,canvas.width,canvas.height)

        const groupSize = setting.barWidth + setting.barSpace
        const maxSize = Math.min(horizonHeight, currentDataArray.length * groupSize)
        const barCount = Math.floor(maxSize / groupSize)
        const step = Math.floor(currentDataArray.length / barCount)

        if(capList.length != barCount){
            capList = new Array(barCount).fill(0);
        }

        // 音频结束时的降落效果
        let hasActiveBars = false;

        // 绘制频谱条
        for (let i = 0; i < barCount; i++) {
            ctx.beginPath();
            let bits;
            // 计算区域平均值
            let sum =0;
            for (let j = i * step; j < (i + 1) * step && j < currentDataArray.length; j++) {
                if(isEnd && j < lastDataArray.length){
                    lastDataArray[j] = Math.max(0, lastDataArray[j] * setting.playEndDropSpeed);
                }
                sum += currentDataArray[j];
            }
            bits = Math.round(sum / step);

            if ( isEnd && bits > 1) hasActiveBars = true;

            const value = bits / 255
            const barHeight = value  * verticalHeight
            // const x = i * groupSize
            // const y = canvas.height- barHeight
            const bounding = getBounding(setting.barWidth,setting.barSpace,i,barHeight,canvas.height,canvas.width,setting.barDirection)

             // 添加发光效果
            if (setting.barShadowColor){
                ctx.beginPath();
                ctx.shadowColor = (getBarColor(setting.barShadowColor,value,ctx,bounding.x,bounding.y,bounding.width,bounding.height) || '#fff') as string
                ctx.shadowBlur = setting.barShadowBlur
                ctx.fillRect(bounding.x, bounding.y, bounding.width,bounding.height)
                ctx.shadowBlur = 0
            }
            
            ctx.fillStyle = getBarColor(setting.barColor,value,ctx,bounding.x,bounding.y,bounding.width,bounding.height) || '#fff'
            if(setting.bricksHeight){
                ctx.beginPath();
                getBricksList(bounding,setting.bricksHeight,setting.bricksSpace,setting.bricksTailOpacityPercent,setting.bricksTailSmallPercent,setting.barDirection,(bounding1)=>{
                    ctx.save();
                    ctx.globalAlpha = bounding1.opacity;
                    // 计算缩放后的尺寸和位置
                    const scaledWidth = bounding1.width * bounding1.scale;
                    const scaledHeight = bounding1.height * bounding1.scale;
                    const scaledX = bounding1.x + (bounding1.width - scaledWidth) / 2;
                    const scaledY = bounding1.y + (bounding1.height - scaledHeight) / 2;
                    ctx.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
                    ctx.restore();  
                })
            }else{
                ctx.fillRect(bounding.x, bounding.y, bounding.width, bounding.height)
            }
            
            // 绘制顶部帽
            if(setting.capsHeight){
                ctx.beginPath();
                
                if(isEnd){
                    capList[i]=(capList[i]<=barHeight)?barHeight:(capList[i] * setting.playEndDropSpeed);
                    if(capList[i]>1){
                        hasActiveBars = true
                    }
                }else{
                    capList[i]=(capList[i]<=barHeight)?barHeight:(capList[i] - setting.capsDropSpeed);
                }
                const capBounding = getCapBounding(bounding,capList[i],setting.capsHeight,canvas.width,canvas.height,setting.barDirection)
                
                ctx.fillStyle = getBarColor(setting.capsColor,value,ctx,capBounding.x,capBounding.y,capBounding.width,capBounding.height) || '#fff';

                ctx.beginPath()
                ctx.fillRect(capBounding.x,capBounding.y,capBounding.width,capBounding.height)
                ctx.fill()
                if(setting.capsShadowColor){
                    ctx.beginPath();
                    ctx.shadowColor = (getBarColor(setting.capsShadowColor,value,ctx,capBounding.x,capBounding.y,capBounding.width,capBounding.height) || '#fff') as string
                    ctx.shadowBlur = setting.capsShadowBlur
                    ctx.fillRect(capBounding.x,capBounding.y,capBounding.width,capBounding.height)
                    ctx.fill()
                    ctx.shadowBlur = 0
                }
            }
        }
        
        // 返回是否还有活跃的条形（用于控制降落动画是否继续）
        return isEnd ? !hasActiveBars : true;
    }
    
    return {
        draw
    }
}
