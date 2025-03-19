import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 🚀 确保 router 被引入

const app = createApp(App);
app.use(router);  // 🚀 绑定 Vue Router
console.log("✅ Router 已加载:", router); // ✅ 调试用，确认 router 被挂载
app.mount('#app');

