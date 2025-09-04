import { App } from 'vue';
import soundWaveBar from '../components/soundWaveBar.vue';

// 插件安装函数（可选的全局注册）
const install = (app: App) => {
  app.component('SoundWave', soundWaveBar);
};

// 默认导出插件对象
export default {
  install,
  soundWaveBar
};

// 导出组件供局部注册使用
export { soundWaveBar };