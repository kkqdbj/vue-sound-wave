
export type BarColorConfig = 
  | string                    // 简单字符串：'red'
  | string[]              // 对象数组
  | Record<string, string|string[]>   // 键值对：{'0.2': 'red', '0.8': 'blue'}

export type soundWaveBaseProps = {
  audioSrc?: string
  width?: number
  height?: number
  // gradientColors?: string[]
  smoothing?:number,
  backgroundColor?: string | string[]
  responsive?: boolean
  showControls?: boolean
  fftSize?:number,
  playEndDropSpeed?:number
}
export type soundWaveBarProps = soundWaveBaseProps & {
  barWidth?: number
  barSpace?: number,
  barColor?: BarColorConfig,
  barColorMode:'auto' | 'fix',
  barShadowColor?:BarColorConfig,
  barShadowBlur?:number,
  barReflection?:boolean,
  barDirection?:'top' |'bottom'|'left'|'right'|'top-bottom'|'left-right',
  barDataSort?:'asc'|'desc'|'middleLow'|'middleHigh'
  barReflectionOpacity?:number,
  barReflectionHeightPercent?:number
  barReflectionDisplay?:'auto' | 'fix'
  capsHeight?:number
  capsColor?:BarColorConfig
  capsShadowColor?:BarColorConfig
  capsShadowBlur?:number,
  capsDropSpeed?:number,
  bricksHeight?:number,
  bricksSpace?:number,
  bricksTailOpacityPercent?:number,
  bricksTailSmallPercent?:number,
}

export type soundWaveLineProps = soundWaveBaseProps & {
  lineUnitWidth?:number,
  lineColor?:BarColorConfig
  lineWidth?:number,
  lineJoin?:CanvasLineJoin,
  lineCap?:CanvasLineCap,
  lineDash?:number[],
  lineDashOffset?:number,
  lineMiterLimit?:number,
  lineDashOffset?:number,
  smooth?:boolean,
}

export type soundWaveSiriLineProps = soundWaveBaseProps & {
  lineColor?:BarColorConfig
  lineWidth?:number,
  speed?:number,
  waveCount?:number
}

export type soundWaveSiriAreaProps = soundWaveBaseProps & {
  colorList?:string[],
  opacity?:number,
  lineCount?:number
}

export {}