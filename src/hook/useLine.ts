import {soundWaveLineProps} from '../../index'
import { getBarColor} from '../utils/color'
import { processData,getBounding} from '../utils/boundingLine'

export function useLine(){
    let capList:number[] = [];
    let lastDataArray:Uint8Array = new Uint8Array();

    // getCapBounding(capList[i],setting.capsHeight,canvas.width,canvas.height,setting.barDirection)

    const draw = (
        canvas:HTMLCanvasElement,
        dataArray:Uint8Array,
        setting:Required<soundWaveLineProps>,
        isEnd:boolean
    ):boolean => {
        const ctx = canvas.getContext('2d')
        if (!ctx) return false
        
        // 清空画布
        ctx.fillStyle = getBarColor(setting.backgroundColor,0,ctx,0,0,canvas.width,canvas.height) || '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 保存当前数据用于音频结束时的降落效果
        if (!isEnd && dataArray.length > 0) {
            lastDataArray = new Uint8Array(dataArray);
        }
        
        const currentDataArray = processData(isEnd ? lastDataArray : dataArray);

        // const {canvas.width,canvas.height} = getcanvas.widthAndcanvas.height(setting.barDirection,canvas.width,canvas.height)

        const groupSize = setting.lineUnitWidth
        const maxSize = Math.min(canvas.width, currentDataArray.length * groupSize)
        const barCount = Math.floor(maxSize / groupSize)
        const step = Math.floor(currentDataArray.length / barCount)

        if(capList.length != barCount){
            capList = new Array(barCount).fill(0);
        }

        // 音频结束时的降落效果
        let hasActiveBars = false;
        
        const offset = Math.floor((currentDataArray.length - step * barCount)/2)

        ctx.strokeStyle=getBarColor(setting.lineColor,0,ctx,0,canvas.height,canvas.width,canvas.height) || '#fff'
        ctx.lineWidth = setting.lineWidth
        ctx.lineJoin = setting.lineJoin
        ctx.lineCap = setting.lineCap
        if(Array.isArray(setting.lineDash) && setting.lineDash.length>0){
            ctx.setLineDash(setting.lineDash)
        }
        ctx.lineDashOffset = setting.lineDashOffset
        ctx.miterLimit = setting.lineMiterLimit
        
        // 先计算所有点的坐标
        const points: Array<{x: number, y: number}> = [];
        
        for (let i = 0; i < barCount; i++) {
            let bits;
            // 计算区域平均值
            let sum = 0;
            for (let j = i * step + offset; j < (i + 1) * step + offset && j < currentDataArray.length; j++) {
                if(isEnd && j-offset < lastDataArray.length){
                    lastDataArray[j-offset] = Math.max(0, lastDataArray[j-offset] * setting.playEndDropSpeed);
                }
                sum += currentDataArray[j];
            }
            bits = Math.round(sum / step);

            if (isEnd && bits > 1) hasActiveBars = true;

            const value = bits / 255;
            const barHeight = value * canvas.height;
            const bounding = getBounding(setting.lineUnitWidth, i, barHeight, canvas.height, canvas.width);
            
            // 根据索引决定是上波峰还是下波谷
            const y = i % 2 === 0 ? bounding.y : bounding.y + bounding.height;
            points.push({
                x: bounding.x + bounding.width / 2,
                y: y
            });
        }

        // 绘制曲线
        ctx.beginPath();
        if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            
            if (setting.smooth && points.length > 2) {
                // 使用二次贝塞尔曲线绘制平滑曲线
                for (let i = 1; i < points.length - 1; i++) {
                    const currentPoint = points[i];
                    const nextPoint = points[i + 1];
                    
                    // 计算控制点（当前点和下一个点的中点）
                    const controlX = (currentPoint.x + nextPoint.x) / 2;
                    const controlY = (currentPoint.y + nextPoint.y) / 2;
                    
                    ctx.quadraticCurveTo(currentPoint.x, currentPoint.y, controlX, controlY);
                }
                // 绘制最后一段
                if (points.length > 1) {
                    const lastPoint = points[points.length - 1];
                    ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, lastPoint.x, lastPoint.y);
                }
            } else {
                // 直线连接
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
            }
        }

        ctx.stroke();

        // 返回是否还有活跃的条形（用于控制降落动画是否继续）
        return isEnd ? !hasActiveBars : true;
    }
    
    return {
        draw
    }
}
