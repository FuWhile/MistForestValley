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
import { ref } from "vue";

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = async () => {
  try {
    // 先尝试使用 Vite 代理
    let response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    // 如果 Vite 代理失败，尝试直接请求后端
    if (!response.ok) {
      console.warn("⚠️ Vite 代理失败，尝试直接请求后端");
      response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });
    }

    const data = await response.json();

    if (response.ok) {
      alert("🎉 登录成功！");
      console.log("✅ Token:", data.token);
      localStorage.setItem("token", data.token); // 存储 Token
      errorMessage.value = ""; // 清空错误信息
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
