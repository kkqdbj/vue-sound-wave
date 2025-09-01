export const createGradient = (ctx:null | CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,colorList:string[]) => {
    if (!ctx) return
    
    const gradient = ctx.createLinearGradient(x1,y1,x2,y2)
    
    const colorSize = colorList.length;

    colorList.forEach((color: string, index: number) => {
        const stop = index / (colorSize - 1)
        gradient.addColorStop(stop, color)
    })

    return gradient;
 }