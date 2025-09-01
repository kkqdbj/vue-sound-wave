import VueSoundWave, { SoundWave } from './plugins/MyPlugin';

// 默认导出插件（用于全局注册）
export default VueSoundWave;

// 导出组件（用于局部注册）
export { SoundWave };

// 类型声明
export interface SoundWaveProps {
  audioSrc?: string;
  width?: number;
  height?: number;
  barWidth?: number;
  barGap?: number;
  gradientColors?: string[];
  backgroundColor?: string;
  responsive?: boolean;
  showControls?: boolean;
  smoothing?: number;
  sensitivity?: number;
}
