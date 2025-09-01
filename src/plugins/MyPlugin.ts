import { App } from 'vue';
import SoundWave from '../components/SoundWave.vue';

// 插件安装函数（可选的全局注册）
const install = (app: App) => {
  app.component('SoundWave', SoundWave);
};

// 默认导出插件对象
export default {
  install,
  SoundWave
};

// 导出组件供局部注册使用
export { SoundWave };