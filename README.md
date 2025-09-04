# vue-sound-wave
🎵 Vue3音频波浪可视化组件

## 项目描述
基于Vue 3 + TypeScript的音频频谱可视化组件库，支持实时音频波浪动画效果。

## 特性
- 🎨 支持自定义渐变色彩
- 🎵 实时音频频谱分析
- 📱 响应式设计
- 🎛️ 内置播放控制
- ⚡ 高性能Canvas渲染
- 🔧 丰富的配置选项

## 安装

```bash
npm install vue-sound-wave
```

## 使用方法

### 局部注册（推荐）

```vue
<template>
  <div>
    <SoundWave
      :audio-src="audioUrl"
      :width="800"
      :height="300"
      :gradient-colors="['#4F46E5', '#7C3AED', '#EC4899', '#EF4444']"
      :show-controls="true"
      :responsive="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SoundWave } from 'vue-sound-wave'

const audioUrl = ref('path/to/your/audio.mp3')
</script>
```

### 全局注册

```typescript
// main.ts
import { createApp } from 'vue'
import VueSoundWave from 'vue-sound-wave'
import App from './App.vue'

const app = createApp(App)
app.use(VueSoundWave)
app.mount('#app')
```

```vue
<!-- 在任何组件中直接使用 -->
<template>
  <SoundWave :audio-src="audioUrl" />
</template>
```

## API 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `audioSrc` | `string` | - | 音频文件URL |
| `width` | `number` | `800` | 画布宽度 |
| `height` | `number` | `200` | 画布高度 |
| `barWidth` | `number` | `4` | 频谱条宽度 |
| `barSpace` | `number` | `2` | 频谱条间距 |
| `gradientColors` | `string[]` | `['#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B']` | 渐变色数组 |
| `backgroundColor` | `string` | `'rgba(15, 23, 42, 0.8)'` | 背景色 |
| `responsive` | `boolean` | `true` | 是否响应式 |
| `showControls` | `boolean` | `true` | 是否显示播放控制 |
| `smoothing` | `number` | `0.8` | 平滑度 (0-1) |
| `sensitivity` | `number` | `1.2` | 敏感度 |

## 方法

通过 `ref` 可以调用组件的方法：

```vue
<template>
  <SoundWave ref="soundWaveRef" :audio-src="audioUrl" />
  <button @click="togglePlay">播放/暂停</button>
</template>

<script setup>
import { ref } from 'vue'
import { SoundWave } from 'vue-sound-wave'

const soundWaveRef = ref()

const togglePlay = () => {
  soundWaveRef.value.play()
}
</script>
```

### 可用方法
- `play()` - 播放/暂停切换
- `pause()` - 暂停播放
- `redraw()` - 重绘静态波浪
- `isPlaying()` - 获取播放状态

## 技术栈
- Vue 3
- TypeScript
- Canvas API
- Web Audio API

## 许可证
MIT
