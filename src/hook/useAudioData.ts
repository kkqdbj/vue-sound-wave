import type {Ref} from 'vue'
import {ref, watch, onMounted, onUnmounted} from 'vue'


export default function useAudioContext<T extends {
    fftSize: number;
    smoothing: number;
    responsive: boolean;
    audioSrc: string;
}>(
    containerRef:Ref<HTMLDivElement | undefined>,
    canvasRef:Ref<HTMLCanvasElement | undefined>[],
    audioRef:Ref<HTMLAudioElement | null>,
    callback:(data: Uint8Array, end: boolean)=>boolean,
    onFinish:()=>void,
    setting: T
) {

    const audioContext = ref<AudioContext>()
    const analyser = ref<AnalyserNode>()
    const dataArray = ref<Uint8Array>()
    const animationId = ref<number>()
    const isPlaying = ref(false)
    const smoothedData = ref<number[]>([])
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
        analyser.value.getByteFrequencyData(dataArray.value);
        callback(dataArray.value,false)
        animationId.value = requestAnimationFrame(draw)
    }

    const drawEnd = function(){
        if(!analyser.value || !dataArray.value){
            return;
        }
        const isOver = callback([] as unknown as Uint8Array,true)
        if(!isOver){
            animationId.value = requestAnimationFrame(drawEnd)
        }else{
            canvasRef.forEach((canvas)=>{
                if(canvas.value){
                    const ctx = canvas.value.getContext('2d')
                    if(ctx){
                        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
                    }
                }
            })
            onFinish?.()
        }
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

    const onAudioEnded = () => {
        isPlaying.value = false
        if (animationId.value) {
           drawEnd();
        }
        // 可以在这里添加播放完毕后的其他逻辑
    }

    const resizeCanvas = () => {
        if (!setting.responsive || !canvasRef || !containerRef.value ) return
        
        const container = containerRef.value
        const dpi = window.devicePixelRatio;
        canvasRef.forEach((canvas)=>{
            if(canvas.value){
                canvas.value.style.width = container.clientWidth + 'px';
                canvas.value.style.height = container.clientHeight + 'px';
                canvas.value.width = container.clientWidth * dpi;
                canvas.value.height = container.clientHeight * dpi;
            }
        })

    }


    onMounted(() => {
        resizeCanvas()
        if (setting.responsive) {
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
        onAudioEnded,
        togglePlay,
        onAudioLoaded,
        isPlaying
    }
}