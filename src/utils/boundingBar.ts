
export const getReflectionBounding = (
    canvasWidth:number,
    canvasHeight:number,
    reflectionHeightPercent:number,
    reflectionDisplay:string,
)=>{
    let bounding1={x:0,y:0,width:0,height:0}
    let bounding2={x:0,y:0,width:0,height:0}
    let bounding3={x:0,y:0,width:0,height:0}

    bounding1={
        x:0,
        y:0,
        width:canvasWidth,
        height:canvasHeight*reflectionHeightPercent
    }
    
    // 绘制倒影，从原图的底部开始截取
    const reflectionHeight = canvasHeight * (1 - reflectionHeightPercent);
    const drawHeight = canvasHeight * reflectionHeightPercent;
    const type = reflectionDisplay
    if(type ==='auto'){
        if(reflectionHeightPercent>=0.5){
            bounding2 = {
                x:0,
                y:canvasHeight - reflectionHeight,
                width:canvasWidth,
                height:reflectionHeight
            }
            bounding3 = {
                x:0,
                y:0,
                width:canvasWidth,
                height:reflectionHeight
            }
        }else{
            bounding2 = {
                x:0,
                y:0,
                width:canvasWidth,
                height:canvasHeight
            }
            bounding3 = {
                x:0,
                y:reflectionHeight - drawHeight,
                width:canvasWidth,
                height:drawHeight
            }
        }
        
    }else if(type ==='fix'){
        bounding2 = {
            x:0,
            y:0,
            width:canvasWidth,
            height:canvasHeight
        }
        bounding3 = {
            x:0,
            y:0,
            width:canvasWidth,
            height:reflectionHeight
        }
    }
    
        
    return {
        bounding1,
        bounding2,
        bounding3
    }
}
export const getHorizonHeightAndVerticalHeight=(direction:string,canvasWidth:number,canvasHeight:number)=>{
    let horizonHeight = 0,verticalHeight = 0;

    if(['top','bottom','top-bottom'].includes(direction)){
        horizonHeight = canvasWidth;
        verticalHeight = canvasHeight;
    }else{
        horizonHeight = canvasHeight;
        verticalHeight = canvasWidth;
    }
    return {horizonHeight,verticalHeight}
}


export const processData = (dataArray:Uint8Array,barDataSort:string)=>{
    
    if(barDataSort === 'asc'){
        const newDataArray = [...dataArray]
        return newDataArray.reverse()
    }else if(barDataSort === 'middleHigh'){
        const newDataArray = [...[...dataArray].reverse(),...dataArray]
        return newDataArray
    }else if(barDataSort === 'middleLow'){
        const newDataArray = [...dataArray,...[...dataArray].reverse()]
        return newDataArray
    }
    return dataArray
}

export const getBounding = (
    barWidth:number,
    barSpace:number,
    index:number,
    barHeight:number,
    canvasHeight:number,
    canvasWidth:number,
    direction:string,
)=>{
    const groupSize = barWidth + barSpace

    switch(direction) {
        case 'top':
            return {
                x:groupSize * index,
                y: canvasHeight - barHeight,
                width: barWidth,
                height: barHeight
            }
        case 'bottom':
            return {
                x: groupSize * index,
                y: 0,
                width: barWidth,
                height: barHeight
            }
        case 'top-bottom':
            return {
                x: groupSize * index,
                y: (canvasHeight - barHeight)/2,
                width: barWidth,
                height: barHeight
            }
        case 'left':
            return {
                x: canvasWidth-barHeight,
                y: groupSize * index,
                width: barHeight,
                height: barWidth
            }
        case 'right':
            return {
                x:0,
                y: groupSize * index,
                width: barHeight,
                height: barWidth
            }
        case 'left-right':
            return {
                x: (canvasWidth - barHeight)/2,
                y: groupSize * index,
                width: barHeight,
                height: barWidth
            }
        default:
            return {x: 0, y: 0, width: 0, height: 0}
    }
}

export const getBricksOpacity = (direction:string,i:number,allSize:number,groupSize:number,bricksTailOpacityPercent:number)=>{
    if(direction === 'top' || direction === 'left'){
        if(i/(allSize*groupSize)<bricksTailOpacityPercent){
            return (i / (bricksTailOpacityPercent * groupSize * allSize)) ;
        }else{
            return 1;
        }
    }else if(direction === 'bottom' || direction === 'right'){
        if((allSize - i/groupSize)/allSize <bricksTailOpacityPercent){
            return (allSize - i/groupSize)/(allSize *bricksTailOpacityPercent)
        }else{
            return 1;
        }
    }else if(direction === 'top-bottom' || direction === 'left-right'){
        if(i/(allSize*groupSize)<1/2 && (i/groupSize)/(allSize/2) <bricksTailOpacityPercent){
            return (i / (bricksTailOpacityPercent * groupSize * allSize /2)) ;
        }else if(i/(allSize*groupSize)>1/2 && (allSize - i/groupSize)/(allSize/2) <bricksTailOpacityPercent){
            return (allSize - i/groupSize)/(allSize *bricksTailOpacityPercent/2)
        }
    }
    return 1;
}


export const getBricksList = (
    bounding:{x:number,y:number,width:number,height:number},
    bricksHeight:number,
    bricksSpace:number,
    bricksTailOpacityPercent:number,
    bricksTailSmallPercent:number,
    direction:string,
    callback:(bounding1:{x:number,y:number,width:number,height:number,opacity:number,scale:number})=>void
)=>{
    const groupSize = bricksHeight + bricksSpace
    let allSize = 1;
    let offset1,offset2;
    switch(direction) {
        case 'top':
        case 'bottom':
        case 'top-bottom':
            offset1 = bounding.y - Math.floor(bounding.y/groupSize) * groupSize
            offset2 = Math.ceil(bounding.height/groupSize) * groupSize - bounding.height
            bounding.height +=offset2 + groupSize
            allSize = Math.floor(bounding.height/groupSize)
            for(let i=0; i<bounding.height; i+=groupSize){
                const _opacity = getBricksOpacity(direction,i,allSize,groupSize,bricksTailOpacityPercent)
                const _scale = getBricksOpacity(direction,i,allSize,groupSize,bricksTailSmallPercent)
                callback({
                    x: bounding.x, 
                    y: bounding.y+i-offset1, 
                    width: bounding.width, 
                    height: Math.min(bricksHeight,bounding.height - i ),
                    opacity:_opacity,
                    scale:_scale
                })
            }
            break
        case 'left':
        case 'right':
        case 'left-right':
            offset1 = bounding.x - Math.floor(bounding.x/groupSize) * groupSize
            offset2 = Math.ceil(bounding.width/groupSize) * groupSize - bounding.width
            bounding.width +=offset2 + groupSize
            allSize = Math.floor(bounding.width/groupSize)
            for(let i=0; i<bounding.width; i+=groupSize){
                const _opacity = getBricksOpacity(direction,i,allSize,groupSize,bricksTailOpacityPercent)
                const _scale = getBricksOpacity(direction,i,allSize,groupSize,bricksTailSmallPercent)
                callback({
                    x: bounding.x+i-offset1, 
                    y: bounding.y, 
                    width: Math.min(bricksHeight,bounding.width - i ),
                    height: bounding.height,
                    opacity:_opacity,
                    scale:_scale
                })
            }
            break
    }
}

export const getCapBounding = (
    bounding:{x:number,y:number,width:number,height:number},
    barHeight:number,
    capHeight:number,
    canvasWidth:number,
    canvasHeight:number,
    direction:string,
)=>{
    switch(direction) {
        case 'top':
            return {
                x: bounding.x,
                y: canvasHeight - barHeight - capHeight,
                width: bounding.width,
                height: capHeight
            }
        case 'bottom':
            return {
                x: bounding.x,
                y: barHeight,
                width: bounding.width,
                height: capHeight
            }
        case 'top-bottom':
            return {
                x: bounding.x,
                y: (canvasHeight - barHeight)/2,
                width: bounding.width,
                height: capHeight
            }
        case 'left':
            return {
                x: canvasWidth - barHeight -capHeight,
                y: bounding.y,
                width: capHeight,
                height: bounding.height
            }
        case 'right':
            return {
                x: barHeight,
                y: bounding.y,
                width: capHeight,
                height: bounding.height
            }
        case 'left-right':
            return {
                x: (canvasWidth - barHeight)/2,
                y: bounding.y,
                width:capHeight,
                height: bounding.height
            }
        default:
            return {x: 0, y: 0, width: 0, height: 0}
    }
}