

export const processData = (dataArray:Uint8Array)=>{
    const newDataArray = [...[...dataArray].reverse(),...dataArray]
    return newDataArray
}

export const getBounding = (
    lineUnitWidth:number,
    index:number,
    barHeight:number,
    canvasHeight:number,
    canvasWidth:number,
)=>{
    const groupSize = lineUnitWidth
    return {
        x: groupSize * index,
        y: (canvasHeight - barHeight)/2,
        width: lineUnitWidth,
        height: barHeight
    }
}
