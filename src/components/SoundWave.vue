<template>
  <div class="sound-wave-container" ref="containerRef">
    <canvas 
      ref="canvasRef" 
      :width="width" 
      :height="height"
      class="sound-wave-canvas"
    ></canvas>
    <audio 
      ref="audioRef" 
      :src="audioSrc" 
      @loadeddata="onAudioLoaded"
      @play="onAudioPlay"
      @pause="onAudioPause"
      crossorigin="anonymous"
      style="display: none;"
    ></audio>
    <div class="controls" v-if="showControls">
      <button @click="togglePlay" class="play-btn">
        {{ isPlaying ? '⏸️' : '▶️' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface Props {
  audioSrc?: string
  width?: number
  height?: number
  barWidth?: number
  barGap?: number
  gradientColors?: string[]
  backgroundColor?: string
  responsive?: boolean
  showControls?: boolean
  smoothing?: number
  sensitivity?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 200,
  barWidth: 4,
  barGap: 2,
  gradientColors: () => ['#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B'],
  backgroundColor: 'rgba(15, 23, 42, 0.8)',
  responsive: true,
  showControls: true,
  smoothing: 0.6,
  sensitivity: 1.2
})

const canvasRef = ref<HTMLCanvasElement>()
const containerRef = ref<HTMLDivElement>()
const audioRef = ref<HTMLAudioElement>()
const audioContext = ref<AudioContext>()
const analyser = ref<AnalyserNode>()
const dataArray = ref<Uint8Array>()
const animationId = ref<number>()
const isPlaying = ref(false)
const smoothedData = ref<number[]>([])
const gradient = ref<CanvasGradient>()


    // watch(() => props.gradientColors, () => {
    //     createGradient()
    // }, { deep: true })

// const draw = () => {
//     if (!canvasRef.value || !analyser.value || !dataArray.value || !gradient.value) return
    
//     const canvas = canvasRef.value
//     const ctx = canvas.getContext('2d')
//     if (!ctx) return
    
//     analyser.value.getByteFrequencyData(dataArray.value)
    
//     // 清空画布
//     ctx.fillStyle = props.backgroundColor
//     ctx.fillRect(0, 0, canvas.width, canvas.height)
    
//     const barCount = Math.floor(canvas.width / (props.barWidth + props.barGap))
//     const step = Math.floor(dataArray.value.length / barCount)
    
//     // 平滑处理数据
//     for (let i = 0; i < barCount; i++) {
//         const targetValue = (dataArray.value[i * step] / 255) * props.sensitivity
//         smoothedData.value[i] = smoothedData.value[i] * 0.85 + targetValue * 0.15
//     }
    
//     // 绘制频谱条
//     for (let i = 0; i < barCount; i++) {
//         const barHeight = smoothedData.value[i] * canvas.height
//         const x = i * (props.barWidth + props.barGap)
//         const y = canvas.height - barHeight
        
//         // 创建每个条的渐变
//         const barGradient = ctx.createLinearGradient(0, canvas.height, 0, parseFloat(y.toFixed(1)))
        
//         // // 根据频率高度选择渐变颜色
//         const intensity = smoothedData.value[i]
//         if (intensity > 0.8) {
//         barGradient.addColorStop(0, '#F59E0B')
//         barGradient.addColorStop(1, '#EF4444')
//         } else if (intensity > 0.6) {
//         barGradient.addColorStop(0, '#EC4899')
//         barGradient.addColorStop(1, '#F59E0B')
//         } else if (intensity > 0.4) {
//         barGradient.addColorStop(0, '#7C3AED')
//         barGradient.addColorStop(1, '#EC4899')
//         } else if (intensity > 0.2) {
//         barGradient.addColorStop(0, '#4F46E5')
//         barGradient.addColorStop(1, '#7C3AED')
//         } else {
//         barGradient.addColorStop(0, '#1E293B')
//         barGradient.addColorStop(1, '#4F46E5')
//         }
        
//         ctx.fillStyle = barGradient
//         ctx.fillRect(x, y, props.barWidth, barHeight)
        
//         // 添加发光效果
//         if (intensity > 0.3) {
//         ctx.shadowColor = props.gradientColors[Math.floor(intensity * (props.gradientColors.length - 1))]
//         ctx.shadowBlur = 10
//         ctx.fillRect(x, y, props.barWidth, barHeight)
//         ctx.shadowBlur = 0
//         }
//     }
    
//     if (isPlaying.value) {
//         animationId.value = requestAnimationFrame(draw)
//     }
//     }
</script>

<style scoped>
.sound-wave-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.sound-wave-canvas {
  display: block;
  border-radius: 8px;
  background: transparent;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.play-btn {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
}

.play-btn:active {
  transform: scale(0.95);
}

</style>
