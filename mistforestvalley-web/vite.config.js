import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // 你的前端端口
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 你的后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 代理 /api 到后端
      },
    },
  },
});




