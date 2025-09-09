import { 
    soundWaveBarProps
    ,soundWaveBaseProps 
    ,soundWaveLineProps,
    soundWaveSiriLineProps,
    soundWaveSiriAreaProps,
} from '../../index'

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
    barReflectionOpacity:0.5,
    barReflectionHeightPercent:0,
    barReflectionDisplay:'auto',
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

export const defaultLine: soundWaveLineProps = {
    ...defaultBase,
    lineUnitWidth:10,
    lineColor:'red',
    lineWidth:2,
    lineJoin:'round',
    lineCap:'round',
    lineDash:[20,20],
    lineDashOffset:0,
    lineMiterLimit:10,
    smooth:true
}


export const defaultSiriLine: soundWaveSiriLineProps = {
    ...defaultBase,
    lineColor:'red',
    lineWidth:2,
    speed:0.4,
    waveCount:6
}

export const defaultSiriArea: soundWaveSiriAreaProps = {
    ...defaultBase,
    lineCount:5,
    opacity:0.7,
    colorList:['#ff0000','#00ff00','#0000ff','#ffff00','#00ffff','#ff00ff']
}

