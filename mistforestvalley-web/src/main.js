import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 🚀 确保 router 被引入

const app = createApp(App);
app.use(router);  // 🚀 绑定 Vue Router
app.mount('#app');

