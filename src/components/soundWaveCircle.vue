<template>
  <div class="sound-wave-container" 
  ref="containerRef" 
  :style="{width: props.width + 'px', height: props.height + 'px',...(attrs.style||{})}" 
  :class="attrs.class">
    <canvas 
      ref="canvasRef" 
      class="sound-wave-canvas"
    ></canvas>
    <audio 
      ref="audioRef" 
      :src="audioSrc" 
      @loadeddata="onAudioLoaded"
      @play="onAudioPlay"
      @pause="onAudioPause"
      @ended="onAudioEnded"
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
import { ref ,useAttrs} from 'vue'
import { defaultLine } from '../setting/index'
import useAudioContext from '../hook/useAudioData'
import type { soundWaveLineProps } from '../../index'
import { useLine } from '../hook/useLine'

const props = withDefaults(defineProps<soundWaveLineProps>(), defaultLine)

const emits = defineEmits(['finish'])

const attrs = useAttrs();

const canvasRef = ref<HTMLCanvasElement>()
const containerRef = ref<HTMLDivElement>()
const audioRef = ref<HTMLAudioElement | null>(null)

const line = useLine();

const handleData = (dataArray:Uint8Array,isEnd?:boolean):boolean=>{
  if(!canvasRef.value ){
    return false;
  }
  return line.draw(canvasRef.value,dataArray,props,isEnd || false)
}

const handleFinish = ()=>{
  console.log('this is finish 11');
  emits('finish')
}

// 使用音频数据处理 hook
const { onAudioPlay, onAudioPause, onAudioEnded, togglePlay, onAudioLoaded, isPlaying } = useAudioContext<Required<soundWaveLineProps>>(
  containerRef,
  [canvasRef],
  audioRef,
  handleData,
  handleFinish,
  props
)

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
  /* background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); */
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.sound-wave-canvas {
  display: block;
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
