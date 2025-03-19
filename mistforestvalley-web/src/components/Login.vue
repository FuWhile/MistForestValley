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
import { useRouter } from "vue-router";  // 引入 Vue 路由

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter(); // 用于页面跳转

// **📌 第 1 步：检测用户是否已登录**
onMounted(() => {
  const token = localStorage.getItem("token");
  if (token) {
    router.push("/home"); // **如果 JWT 存在，自动跳转主页**
  }
});

// **📌 第 2 步：处理用户登录**
const handleLogin = async () => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // **📌 第 3 步：存储 Token**
      localStorage.setItem("token", data.token); // 存储 Token
      errorMessage.value = ""; // 清空错误信息

      // **📌 第 4 步：判断是否是第一次登录**
      if (data.password_changed === 0) {
        router.push("/change-password");  // **跳转到修改密码页面**
      } else {
        // **📌 第 5 步：根据角色跳转**
        if (data.role === 'admin') {
          router.push("/user-center/admin");
        } else if (data.role === 'farmer') {
          router.push("/user-center/farmer");
        } else if (data.role === 'npc') {
          router.push("/user-center/npc");
        } else if (data.role === 'merfolk') {
          router.push("/user-center/merfolk");
        } else if (data.role === 'junimo') {
          router.push("/user-center/junimo");
        } else {
          router.push("/home");  // **默认跳转到主页**
        }
      }
    } else {
      errorMessage.value = data.error || "登录失败";
    }
  } catch (error) {
    errorMessage.value = "❌ 服务器连接失败";
  }
};
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 50px;
}
input {
  padding: 8px;
  font-size: 16px;
}
button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.error {
  color: red;
}
</style>
