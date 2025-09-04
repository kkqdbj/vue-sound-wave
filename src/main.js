import { createApp } from 'vue';
import App from './App.vue';
import soundWave from './plugins/index.ts';
 
const app = createApp(App);
app.use(soundWave);
app.mount('#app');