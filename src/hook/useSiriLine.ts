import {soundWaveLine2Props} from '../../index'
import { getBarColor} from '../utils/color'
import { processData,getBounding} from '../utils/boundingLine'

export function useSiriLine(){
    let lastDataArray:Uint8Array = new Uint8Array();
    let offset = 0;

    // getCapBounding(capList[i],setting.capsHeight,canvas.width,canvas.height,setting.barDirection)
    const GRAPH_X = 2;
    const pixelDepth = 0.02;
    const ATT_FACTOR =4
    const globalAttFn = (x: number): number =>{
        return Math.pow(ATT_FACTOR / (ATT_FACTOR + Math.pow(x, ATT_FACTOR)), 1);
    }
    const xPos = (x:number,width:number) => width * (x + GRAPH_X) / (2 * GRAPH_X);
    const yPos = (x:number,setting:Required<soundWaveLine2Props>) => {
        const value = globalAttFn(x) 
        
        return value * Math.sin(setting.waveCount*x - offset);
    };

    const draw = (
        canvas:HTMLCanvasElement,
        dataArray:Uint8Array,
        setting:Required<soundWaveLine2Props>,
        isEnd:boolean
    ):boolean => {

        let hasActiveBars = false;

        const ctx = canvas.getContext('2d')
        if (!ctx ) return false
       
         // 保存当前数据用于音频结束时的降落效果
         if (!isEnd && dataArray.length > 0) {
            lastDataArray = new Uint8Array(dataArray);
        }

        if(isEnd){
            lastDataArray[0] = Math.max(0, lastDataArray[0] * setting.playEndDropSpeed);
            if(lastDataArray[0] >0){
                hasActiveBars = true;
            }
        }
        const currentDataArray = isEnd ? lastDataArray : dataArray;

        const value =currentDataArray[0]/255;
        
        // 清空画布
        ctx.fillStyle = getBarColor(setting.backgroundColor,0,ctx,0,0,canvas.width,canvas.height) || '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle=getBarColor(setting.lineColor,0,ctx,0,canvas.height,canvas.width,canvas.height) || '#fff'
        ctx.lineWidth = setting.lineWidth

        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        offset = (offset+setting.speed)%(Math.PI*2);
        for (let i = -GRAPH_X; i <= GRAPH_X; i += pixelDepth!) {
            const x = xPos(i,canvas.width)
            const y = canvas.height * value* yPos(i,setting) / 2 + canvas.height / 2;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        return isEnd ? !hasActiveBars : true;
    }
    
    return {
        draw
    }
}
