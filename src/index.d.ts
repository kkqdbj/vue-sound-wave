declare namespace soundWave{
    export interface commonProps{
            audioSrc?: string
            width?: number
            height?: number
            // gradientColors?: string[]
            backgroundColor?: string
            responsive?: boolean
            showControls?: boolean
            smoothing?: number
            sensitivity?: number
    }
    export interface barProps{
            barWidth?: number
            barGap?: number
    }
}