import {soundWaveBarProps} from '../../index'
import { getBarColor} from '../utils/color'
import { processData,getBounding,getBricksList,getCapBounding,getHorizonHeightAndVerticalHeight,getReflectionBounding } from '../utils/boundingBar'

export function useBar(){
    let capList:number[] = [];
    let lastDataArray:Uint8Array = new Uint8Array();

    // getCapBounding(capList[i],setting.capsHeight,canvas.width,canvas.height,setting.barDirection)

    const draw = (
        canvas:HTMLCanvasElement,
        canvasClone:HTMLCanvasElement,
        dataArray:Uint8Array,
        setting:Required<soundWaveBarProps>,
        isEnd:boolean
    ):boolean => {
        const ctx = canvas.getContext('2d')
        const ctxClone = canvasClone.getContext('2d')
        if (!ctx || !ctxClone) return false
        
        // 清空画布
        ctxClone.clearRect(0, 0, canvasClone.width, canvasClone.height)

        // 保存当前数据用于音频结束时的降落效果
        if (!isEnd && dataArray.length > 0) {
            lastDataArray = new Uint8Array(dataArray);
        }
        
        const currentDataArray = processData(isEnd ? lastDataArray : dataArray,setting.barDataSort);

        const {horizonHeight,verticalHeight} = getHorizonHeightAndVerticalHeight(setting.barDirection,canvasClone.width,canvasClone.height)

        const groupSize = setting.barWidth + setting.barSpace
        const maxSize = Math.min(horizonHeight, currentDataArray.length * groupSize)
        const barCount = Math.floor(maxSize / groupSize)
        const step = Math.floor(currentDataArray.length / barCount)

        if(capList.length != barCount){
            capList = new Array(barCount).fill(0);
        }

        // 音频结束时的降落效果
        let hasActiveBars = false;
        
        const offset = Math.floor((currentDataArray.length - step * barCount)/2)

        if(setting.barColorMode === 'fix'){
            if('top'===setting.barDirection && setting.barReflectionHeightPercent && setting.barReflectionOpacity){
                ctxClone.fillStyle = getBarColor(setting.barColor,0,ctx,0,0,horizonHeight,verticalHeight * setting.barReflectionHeightPercent) || '#fff'
            }else{
                ctxClone.fillStyle = getBarColor(setting.barColor,0,ctx,0,canvasClone.height,horizonHeight,verticalHeight) || '#fff'
            }
        }
        // 绘制频谱条
        for (let i = 0; i < barCount; i++) {
            ctxClone.beginPath();
            let bits;
            // 计算区域平均值
            let sum =0;
            for (let j = i * step + offset; j < (i + 1) * step + offset && j < currentDataArray.length; j++) {
                if(isEnd && j-offset < lastDataArray.length){
                    lastDataArray[j-offset] = Math.max(0, lastDataArray[j-offset] * setting.playEndDropSpeed);
                }
                sum += currentDataArray[j];
            }
            bits = Math.round(sum / step);

            if ( isEnd && bits > 1) hasActiveBars = true;

            const value = bits / 255
            const barHeight = value  * verticalHeight
            // const x = i * groupSize
            // const y = canvas.height- barHeight
            const bounding = getBounding(setting.barWidth,setting.barSpace,i,barHeight,canvasClone.height,canvasClone.width,setting.barDirection)

             // 添加发光效果
            if (setting.barShadowColor){
                ctxClone.beginPath();
                ctxClone.save();
                ctxClone.shadowColor = (getBarColor(setting.barShadowColor,value,ctx,bounding.x,bounding.y,bounding.width,bounding.height) || '#fff') as string
                ctxClone.shadowBlur = setting.barShadowBlur
                ctxClone.fillRect(bounding.x, bounding.y, bounding.width,bounding.height)
                ctxClone.shadowBlur = 0
                ctxClone.restore();
            }
            if(setting.barColorMode === 'auto'){
                ctxClone.fillStyle = getBarColor(setting.barColor,value,ctx,bounding.x,bounding.y,bounding.width,bounding.height) || '#fff'
            }
            if(setting.bricksHeight){
                ctxClone.beginPath();
                getBricksList(bounding,setting.bricksHeight,setting.bricksSpace,setting.bricksTailOpacityPercent,setting.bricksTailSmallPercent,setting.barDirection,(bounding1)=>{
                    ctxClone.save();
                    ctxClone.globalAlpha = bounding1.opacity;
                    // 计算缩放后的尺寸和位置
                    const scaledWidth = bounding1.width * bounding1.scale;
                    const scaledHeight = bounding1.height * bounding1.scale;
                    const scaledX = bounding1.x + (bounding1.width - scaledWidth) / 2;
                    const scaledY = bounding1.y + (bounding1.height - scaledHeight) / 2;
                    ctxClone.fillRect(scaledX, scaledY, scaledWidth, scaledHeight);
                    ctxClone.restore();  
                })
            }else{
                ctxClone.fillRect(bounding.x, bounding.y, bounding.width, bounding.height)
            }
            
            // 绘制顶部帽
            if(setting.capsHeight){
                ctxClone.beginPath();
                ctxClone.save();
                if(isEnd){
                    capList[i]=(capList[i]<=barHeight)?barHeight:(capList[i] * setting.playEndDropSpeed);
                    if(capList[i]>1){
                        hasActiveBars = true
                    }
                }else{
                    capList[i]=(capList[i]<=barHeight)?barHeight:(capList[i] - setting.capsDropSpeed);
                }
                const capBounding = getCapBounding(bounding,capList[i],setting.capsHeight,canvasClone.width,canvasClone.height,setting.barDirection)
                
                ctxClone.fillStyle = getBarColor(setting.capsColor,value,ctx,capBounding.x,capBounding.y,capBounding.width,capBounding.height) || '#fff';

                ctxClone.fillRect(capBounding.x,capBounding.y,capBounding.width,capBounding.height)
                ctxClone.fill()
                if(setting.capsShadowColor){
                    ctxClone.beginPath();
                    ctxClone.shadowColor = (getBarColor(setting.capsShadowColor,value,ctx,capBounding.x,capBounding.y,capBounding.width,capBounding.height) || '#fff') as string
                    ctxClone.shadowBlur = setting.capsShadowBlur
                    ctxClone.fillRect(capBounding.x,capBounding.y,capBounding.width,capBounding.height)
                    ctxClone.fill()
                    ctxClone.shadowBlur = 0
                }
                ctxClone.restore();
            }
        }


        // 清空画布
        ctx.fillStyle = getBarColor(setting.backgroundColor,0,ctx,0,0,canvas.width,canvas.height) || '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if('top'===setting.barDirection && setting.barReflectionHeightPercent && setting.barReflectionOpacity){

           const reflectBounding = getReflectionBounding(canvas.width,canvas.height,setting.barReflectionHeightPercent,setting.barReflectionDisplay)
           
            ctx?.drawImage(canvasClone,reflectBounding.bounding1.x,reflectBounding.bounding1.y,reflectBounding.bounding1.width,reflectBounding.bounding1.height);
            
            // 绘制倒影（下半部分）
            ctx?.save();
            ctx.globalAlpha = setting.barReflectionOpacity;
            // 移动到倒影开始位置
            ctx.translate(0, canvas.height);
            // 垂直翻转
            ctx.scale(1, -1);

            ctx?.drawImage(
                canvasClone, 
                reflectBounding.bounding2.x, reflectBounding.bounding2.y, reflectBounding.bounding2.width, reflectBounding.bounding2.height,
                reflectBounding.bounding3.x, reflectBounding.bounding3.y, reflectBounding.bounding3.width, reflectBounding.bounding3.height
            );
            
            ctx?.restore();
        }else{
            ctx?.drawImage(canvasClone, 0, 0, canvas.width, canvas.height);
        }
        
        // 返回是否还有活跃的条形（用于控制降落动画是否继续）
        return isEnd ? !hasActiveBars : true;
    }
    
    return {
        draw
    }
}
