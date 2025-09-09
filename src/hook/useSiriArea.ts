import {soundWaveSiriAreaProps} from '../../index'
import { getBarColor} from '../utils/color'

interface waveType {
    NO_OF_CURVES: number,
    spawnAt:number,
    offset: number[],
    width: number[],
    amplitudes: number[],
    maxAmplitudes:number[],
    color: string,
    verses: number[],
    speeds: number[],
    phases:number[],
    despawnTimeouts:number[],
    prevMaxY:number,
}

const GRAPH_X = 25;
const pixelDepth = 0.02;
const ATT_FACTOR =4;
const DESPAWN_FACTOR = 0.02;
const globalAttFn = (x: number): number =>{
    return Math.pow(ATT_FACTOR / (ATT_FACTOR + Math.pow(x, ATT_FACTOR)), 1);
}
const getRandomRange = (e: [number, number]): number => {
    return e[0] + Math.random() * (e[1] - e[0]);
}
const xPos = (x:number,width:number) => width * (x + GRAPH_X) / (2 * GRAPH_X);
const yPos = (x:number,wave:waveType) => {
    let y = 0;
    for (let ci = 0; ci < wave.NO_OF_CURVES; ci++) {
        let t = 4* (-1 + (ci / (wave.NO_OF_CURVES - 1)) * 2);
        t += wave.offset[ci];

        const k = 1/ wave.width[ci];
        const _x = x * k- t;

        y += Math.abs(wave.amplitudes[ci]* Math.sin(wave.verses[ci]*_x + wave.phases[ci]) * globalAttFn(_x));
    }

    // Divide for NoOfCurves so that y <= 1
    return (y / wave.NO_OF_CURVES) * globalAttFn((x/GRAPH_X)*2);
};


const createSubWave = (value:number,colorList:string[])=>{
    const NO_OF_CURVES = Math.ceil(getRandomRange([2,5]));
    const len =NO_OF_CURVES;
    const offset = new Array(len).fill(0).map(()=>getRandomRange([-3,3]))
    const width = new Array(len).fill(0).map(()=>getRandomRange([1,5]))
    const maxAmplitudes = new Array(len).fill(0).map(()=>value)
    const verses = new Array(len).fill(0).map(()=>getRandomRange([1,3]))
    const speeds = new Array(len).fill(0).map(()=>getRandomRange([.1,.2])*(Math.random()>.8?1:-1))
    const despawnTimeouts = new Array(len).fill(0).map(()=>getRandomRange([500,1500])*value)
    const spawnAt = +(Date.now());
    const color = colorList[Math.floor(Math.random()*colorList.length)]
    return {
        NO_OF_CURVES,
        offset,
        width,
        maxAmplitudes,
        color,
        speeds,
        amplitudes:new Array(len).fill(0),
        phases:new Array(len).fill(0),
        spawnAt,
        despawnTimeouts,
        verses,
        prevMaxY:-1
    }
}

const moveChange = (wave:waveType,value:number)=>{
    for (let ci = 0; ci < wave.NO_OF_CURVES; ci++) {
      if (wave.spawnAt + wave.despawnTimeouts[ci] <= +(Date.now())) {
        wave.amplitudes[ci] -= value*DESPAWN_FACTOR;
      } else {
        wave.amplitudes[ci] += value*DESPAWN_FACTOR;
      }
      wave.amplitudes[ci] = Math.min(Math.max(wave.amplitudes[ci], 0), wave.maxAmplitudes[ci]);
      wave.phases[ci] = (wave.phases[ci] + value * wave.speeds[ci] ) % (2 * Math.PI);
    }
}

export function useSiriArea(){
    let lastDataArray:Uint8Array = new Uint8Array();
    
    let waveList:waveType[] = [];

    const draw = (
        canvas:HTMLCanvasElement,
        dataArray:Uint8Array,
        setting:Required<soundWaveSiriAreaProps>,
        isEnd:boolean
    ):boolean => {

        let hasActiveBars = false;

        if(waveList.length ===0 && !isEnd){
           waveList =  new Array(setting.lineCount).fill(0).map(()=>createSubWave(.1,setting.colorList))
        }
        const ctx = canvas.getContext('2d')
        if (!ctx) return false
       
         // 保存当前数据用于音频结束时的降落效果
         if (!isEnd && dataArray.length > 0) {
            lastDataArray = new Uint8Array(dataArray);
        }

        const currentDataArray = isEnd ? lastDataArray : dataArray;

        const value = currentDataArray[0]/255;
        
        // 清空画布
        ctx.fillStyle = getBarColor(setting.backgroundColor,0,ctx,0,0,canvas.width,canvas.height) || '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.globalAlpha = setting.opacity  ;
        
        waveList.forEach(wave=>{
            moveChange(wave,value);
        });
       
        const directions = [1,-1] as number[]
        directions.forEach(direction=>{
            waveList.forEach((wave,index)=>{
                ctx.fillStyle=wave.color
                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2);
            
                let _maxY = -Infinity
                for (let i = -GRAPH_X; i <= GRAPH_X; i += pixelDepth!) {
                    const x = xPos(i,canvas.width)
                    const _ypos =  yPos(i,wave)
                    const y = direction * canvas.height/2 *_ypos+ canvas.height / 2;
                    ctx.lineTo(x, y);
                    _maxY = Math.max(_maxY, Math.abs(y - canvas.height / 2));
                }
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.closePath();
                ctx.globalCompositeOperation = 'lighter';
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
                if(_maxY <=0 && wave.prevMaxY >=0){
                    if(isEnd){
                        waveList.splice(index,1)
                    }else{
                        waveList.splice(index,1,createSubWave(value,setting.colorList))
                    }
                }

                wave.prevMaxY = _maxY;
            });
            
        });

        if(isEnd && waveList.length){
            hasActiveBars = true;
        }
        
        return isEnd ? !hasActiveBars : true;
    }
    
    return {
        draw
    }
}
