
<template>
  <div class="app">
   <!-- <SoundWaveBar 
   audioSrc="/test.mp3" 
   :width="200" 
   :height="100" 
   :barDirection="'top'"
   :backgroundColor="backgroundColor"
   :bricksHeight="10" 
   :barSpace="1"
   :bricksSpace="4"
   :ltr="false"
   :smoothing = '0.9' 
   :barWidth="10" 
   :barColor="bgColor"
   :barColorMode="'fix'"
   :barShadowColor="bgShadowColor"
   :capsColor="capsColor"
   :barReflectionOpacity="0.5"
   :barReflectionHeightPercent="0.8"
   :barReflectionDisplay="'auto'"
   :capsShadowColor="capsShadowColor"
   :capsShadowBlur="10"
   :bricksTailOpacityPercent="0.5"
   :bricksTailSmallPercent="0.5"
   barDataSort ='middleHigh'
   :barShadowBlur="10"
   :capsHeight="0" 
   @finish="handleFinish"
   /> -->
   <!-- <SoundWaveLine 
   audioSrc="/test1.wav" 
   :backgroundColor="backgroundColor"
   :lineUnitWidth="30"
   :width="200" 
   :height="100" 
   :lineColor="bgColor"
   :lineWidth="10"
   :lineDash="[]"
   :smooth="true"
   @finish="handleFinish"
   /> -->
   <!-- <SoundWaveSiriLine
    audioSrc="/test.mp3"
    :backgroundColor="backgroundColor"
    :lineColor="bgColor"
    :lineWidth="10"
    :waveCount="5"
    :width="200" 
    :height="100"
   /> -->
   <!-- <SoundWaveSiriArea
    audioSrc="/test2.wav"
    :backgroundColor="backgroundColor"
    :opacity="0.8"
    :lineCount="10"
    :width="200" 
    :height="100"
   /> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SoundWaveBar from './components/soundWaveBar.vue'
import SoundWaveLine from './components/soundWaveLine.vue'
import SoundWaveSiriLine from './components/soundWaveSiriLine.vue'
import SoundWaveSiriArea from './components/soundWaveSiriArea.vue'
const handleFinish = ()=>{
  console.log('this is finish');
}
// const bgColor ='linear-gradient(90deg, red 0%, blue 30%,green 60%,yellow 100%)'
// const bgColor = 'radial-gradient(circle, red 0%, blue 30%,green 60%,transparent 100%)'
// const bgColor = 'conic-gradient(from 90deg, red 0%, blue 30%,green 60%,transparent 100%)'
// const bgColor = [{value: '0.2', color: 'red'}, {value: '0.8', color: 'blue'}]

// const bgColor = [
//     { value: 0.8, color: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' },
//     { value: 0.6, color: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 100%)' },
//     { value: 0.4, color: 'linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)' },
//     { value: 0.2, color: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)' },
//     { value: 0, color: 'linear-gradient(90deg, #1E293B 0%, #4F46E5 100%)' }
// ]

// const bgColor = {
//   0.8: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
//   0.6: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 100%)',
//   0.4: 'linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)',
//   0.2: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
//   0: 'linear-gradient(90deg, #1E293B 0%, #4F46E5 100%)'
// }
const backgroundColor = ['130deg','red','blue',]
const bgColor = ['0deg','red','yellow','red']
// const capsColor = {
//   0.8: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
//   0.6: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 100%)',
//   0.4: 'linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)',
//   0.2: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
//   0: 'linear-gradient(90deg, #1E293B 0%, #4F46E5 100%)'
// }
const capsColor = 'red'

// const capsShadowColor = {
//   0.8: 'red',
//   0.6: 'blue',
//   0.4: '#fff',
//   0.2: 'yellow',
//   0: 'black'
// }
const capsShadowColor = 'black'

// const bgShadowColor = {
//   0.8: 'red',
//   0.6: 'blue',
//   0.4: '#fff',
//   0.2: 'yellow',
//   0: 'black'
// }
// const bgShadowColor = 'red'
</script>
<style scoped>
.abcd{
    margin:20px;
}
</style>
