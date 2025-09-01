import type {Ref} from 'vue'
import {ref, watch, onMounted, onUnmounted, nextTick} from 'vue'


export default function useAudioContext<T>(
    containerRef:Ref<HTMLDivElement>,
    canvasRef:Ref<HTMLCanvasElement>,
    audioRef:Ref<HTMLAudioElement | null>,
    callback:(data: Uint8Array<ArrayBuffer>)=>void,
    setting:T & {
        fftSize:number,
        smoothing:number,
        responsive:boolean,
        audioSrc:string
    }){

    const audioContext = ref<AudioContext>()
    const analyser = ref<AnalyserNode>()
    const dataArray = ref<Uint8Array<ArrayBuffer>>()
    const animationId = ref<number>()
    const isPlaying = ref(false)
    const smoothedData = ref<number[]>([])
    // const gradient = ref<CanvasGradient>()
    const source = ref<MediaElementAudioSourceNode | null>(null)

    const initAudioContext = async () => {
        if(!audioRef.value){
            return ;
        }
        audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
        source.value = audioContext.value.createMediaElementSource(audioRef.value)
        
        analyser.value = audioContext.value.createAnalyser()
        analyser.value.fftSize = setting.fftSize
        analyser.value.smoothingTimeConstant = setting.smoothing
        
        source.value.connect(analyser.value)
        analyser.value.connect(audioContext.value.destination)
        
        const bufferLength = analyser.value.frequencyBinCount
        dataArray.value = new Uint8Array(bufferLength);
        smoothedData.value = new Array(bufferLength).fill(0)
        
    }

    const draw = function(){
        if(!analyser.value || !dataArray.value){
            return;
        }
        analyser.value.getByteFrequencyData(dataArray.value )
        callback(dataArray.value)
        animationId.value = requestAnimationFrame(draw)
    }

    // 音频控制方法
    const togglePlay = async () => {
        if (!audioRef.value) return
        
        if (audioContext.value?.state === 'suspended') {
            await audioContext.value.resume()
        }
        
        if (isPlaying.value) {
            audioRef.value.pause()
        } else {
            try {
                await audioRef.value.play()
            } catch (error) {
                console.error('播放失败:', error)
            }
        }
    }

    const onAudioLoaded = () => {
    if (!audioContext.value) {
        initAudioContext()
    }
    }

    const onAudioPlay = () => {
        isPlaying.value = true
        if (analyser.value && dataArray.value) {
            draw()
        }
    }

    const onAudioPause = () => {
        isPlaying.value = false
        if (animationId.value) {
            cancelAnimationFrame(animationId.value)
        }
    }

    const resizeCanvas = () => {
        if (!setting.responsive || !canvasRef.value || !containerRef.value) return
        
        const container = containerRef.value
        canvasRef.value.width = container.clientWidth
        canvasRef.value.height = container.clientHeight
    }

    onMounted(() => {
        
        if (setting.responsive) {
            resizeCanvas()
            window.addEventListener('resize', resizeCanvas)
        }
    
    })

    onUnmounted(() => {
        if (animationId.value) {
            cancelAnimationFrame(animationId.value)
        }
        
        if (audioContext.value) {
            audioContext.value.close()
        }
        
        if (setting.responsive) {
            window.removeEventListener('resize', resizeCanvas)
        }
    })

    watch(() => setting.audioSrc, async (newSrc) => {
        if (animationId.value) {
            cancelAnimationFrame(animationId.value)
        }
        
        if (newSrc && audioRef.value) {
            audioRef.value.src = newSrc
        }
    })

    return {
        onAudioPlay,
        onAudioPause,
        togglePlay,
        onAudioLoaded
    }
    // 暴露方法给父组件
    // defineExpose({
    //     play: togglePlay,
    //     pause: () => audioRef.value?.pause(),
    //     isPlaying: () => isPlaying.value
    // })
}