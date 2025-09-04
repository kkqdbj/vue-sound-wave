
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
  backgroundColor?: string
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
  barReflectionOpacity?:boolean,
  barReflectionHeightPercent?:number
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

export {}