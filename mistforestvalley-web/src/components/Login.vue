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
import { useRouter } from "vue-router";  

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();  

console.log("✅ Router 实例:", router); // 🌟 确保 router 存在

// **📌 页面加载时检查是否已登录**
onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("✅ 检测到已登录 Token，自动跳转到 Home");
    router.push("/home").catch(err => console.error("⚠️ 跳转失败:", err));
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
      localStorage.setItem("token", data.token);  // ✅ 存储 Token
      errorMessage.value = "";  

      console.log("✅ 登录成功，用户角色：", data.role);  

      // **📌 确保角色存在**
      if (!data.role) {
        console.error("❌ 角色信息丢失，无法跳转");
        errorMessage.value = "服务器数据异常";
        return;
      }

      // **📌 判断是否是第一次登录**
      if (data.password_changed === 0) {
        console.log("🔄 首次登录，跳转到修改密码页面");
        router.push("/change-password").catch(err => console.error("⚠️ 修改密码页面跳转失败:", err));
      } else {
        // **📌 根据角色跳转**
        const roleRoutes = {
          admin: "/user-center/admin",
          farmer: "/user-center/farmer",
          npc: "/user-center/npc",
          merfolk: "/user-center/merfolk",
          junimo: "/user-center/junimo",
        };

        if (!roleRoutes[data.role]) {
          console.warn("⚠️ 未知角色，跳转 Home", data.role);
        }

        console.log(`🚀 跳转到角色专属页面: ${roleRoutes[data.role] || "/home"}`);
        router.push(roleRoutes[data.role] || "/home").catch(err => console.error("⚠️ 角色页面跳转失败:", err));
      }
    } else {
      errorMessage.value = data.error || "登录失败";
      console.error("❌ 登录失败:", data.error);
    }
  } catch (error) {
    errorMessage.value = "❌ 服务器连接失败";
    console.error("❌ 网络错误:", error);
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

