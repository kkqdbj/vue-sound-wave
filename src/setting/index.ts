import { soundWaveBarProps,soundWaveBaseProps ,BarColorConfig} from '../../index'

export const defaultBase: soundWaveBaseProps ={
    audioSrc: '',
    width: 800,
    height: 200,
    backgroundColor: '#000',
    responsive: true,
    showControls: true,
    smoothing:0.8,
    playEndDropSpeed:0.8,
    fftSize:1024,
}

export const defaultBar: soundWaveBarProps = {
    ...defaultBase,
    barWidth: 4,
    barSpace: 2,
    barColor:'red',
    barShadowColor:'',
    barShadowBlur:10,
    barColorMode:'auto',
    barDirection:'top',
    barDataSort:'desc',
    barReflectionOpacity:false,
    barReflectionHeightPercent:0.5,
    barReflection:false,
    smoothing:0.8,
    capsHeight:2,
    capsColor:'#fff',
    capsShadowColor:'',
    capsShadowBlur:10,
    capsDropSpeed:1,
    bricksHeight:10,
    bricksSpace:5,
    bricksTailOpacityPercent:0,
    bricksTailSmallPercent:0
}