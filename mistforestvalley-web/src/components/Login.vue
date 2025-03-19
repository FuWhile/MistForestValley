<template>
  <div class="login-container">
    <h2>用户登录</h2>
    <input v-model="username" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button @click="handleLogin">登录</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";  // ✅ 引入 Vue Router

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();  // ✅ 获取 router 实例

// **📌 检查是否已登录**
onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    router.push("/home");  // ✅ 自动跳转到主页
  }
});

// **📌 处理登录逻辑**
const handleLogin = async () => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token); // ✅ 存储 Token
      errorMessage.value = "";  // 清空错误信息

      // **📌 判断是否是第一次登录**
      if (data.password_changed === 0) {
        router.push("/change-password");  // ✅ 跳转到修改密码页面
      } else {
        // **📌 根据角色跳转**
        const roleRoutes = {
          admin: "/user-center/admin",
          farmer: "/user-center/farmer",
          npc: "/user-center/npc",
          merfolk: "/user-center/merfolk",
          junimo: "/user-center/junimo",
        };
        router.push(roleRoutes[data.role] || "/home");
      }
    } else {
      errorMessage.value = data.error || "登录失败";
    }
  } catch (error) {
    errorMessage.value = "❌ 服务器连接失败";
  }
};
</script>

<style scoped>
.login-container { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 50px; }
input { padding: 8px; font-size: 16px; }
button { padding: 8px 16px; background-color: #007bff; color: white; border: none; cursor: pointer; }
button:hover { background-color: #0056b3; }
.error { color: red; }
</style>

