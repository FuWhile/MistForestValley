<template>
  <div class="change-password-container">
    <h2>修改密码</h2>
    <input v-model="newPassword" type="password" placeholder="新密码" />
    <input v-model="confirmPassword" type="password" placeholder="确认新密码" />
    <button @click="handleChangePassword">确认修改</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';

const newPassword = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const router = useRouter();

const handleChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "两次输入的密码不一致";
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    errorMessage.value = "请先登录";
    return;
  }

  try {
    const response = await fetch("/api/change-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        newPassword: newPassword.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("密码修改成功！");
      router.push("/user-center");  // 修改密码成功后跳转到用户中心
    } else {
      errorMessage.value = data.error || "修改密码失败";
    }
  } catch (error) {
    errorMessage.value = "服务器连接失败";
  }
};
</script>

<style>
.change-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 50px;
}
.error {
  color: red;
}
</style>
