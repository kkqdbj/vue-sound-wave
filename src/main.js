import { createApp } from 'vue';
import App from './App.vue';
import MyPlugin from './plugins/MyPlugin.ts';
 
const app = createApp(App);
app.use(MyPlugin);
app.mount('#app');