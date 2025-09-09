

/**
 * 根据频率值和颜色配置获取对应的颜色
 * @param barColorConfig 颜色配置
 * @param value 频率值 (0-1)
 * @param ctx Canvas 2D 上下文
 * @param x 渐变起始X坐标
 * @param y 渐变起始Y坐标
 * @param width 宽度
 * @param height 高度
 * @returns 颜色字符串或渐变对象
 */
export const getBarColor = (
    barColorConfig: string | Array<string> | Record<string, string|string[]>,
    value: number,
    ctx: CanvasRenderingContext2D | null,
    x: number = 0,
    y: number = 0,
    width: number = 100,
    height: number = 100
): string | CanvasGradient | null => {
    if (!ctx) return null;

    // 如果是字符串，直接解析渐变或返回颜色
    if (typeof barColorConfig === 'string') {
        return barColorConfig
    }

    // 如果是数组格式，创建Canvas线性渐变
    if (Array.isArray(barColorConfig)) {
        if (barColorConfig.length === 1) {
            return barColorConfig[0];
        }
        
        let angle = 90 ;
        const firstValue = barColorConfig[0];
        let colors = barColorConfig

        if(/^\d+(\.\d+)?\s*(deg|rad)?$/.test(firstValue)){
            angle = parseFloat(firstValue)
            colors = barColorConfig.slice(1)
        }
        
        // 将角度转换为弧度
        const radians = (angle * Math.PI) / 180;
        
        // 计算渐变的起点和终点
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const length = Math.sqrt(width * width + height * height) / 2;
        
        const x1 = centerX - Math.cos(radians) * length;
        const y1 = centerY - Math.sin(radians) * length;
        const x2 = centerX + Math.cos(radians) * length;
        const y2 = centerY + Math.sin(radians) * length;
        
        // 创建Canvas线性渐变对象
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        
        // 添加颜色停止点，均匀分布
        colors.forEach((color, index) => {
            const position = index / (colors.length - 1);
            gradient.addColorStop(position, color);
        });
        
        return gradient;
    }

    // 
    if (typeof barColorConfig === 'object') {
        // 如果是对象格式，根据value值查找对应的颜色配置
        const keys = Object.keys(barColorConfig).map(Number).sort((a, b) => a - b);
        let targetKey = keys[0];

        // 找到最接近的key值
        for (const key of keys) {
            if (value >= key) {
                targetKey = key;
            } else {
                break;
            }
        }

        const colorValue = barColorConfig[targetKey.toString()];
        return getBarColor(colorValue,value,ctx,x,y,width,height)
    }

    return '#fff'; // 默认颜色
}