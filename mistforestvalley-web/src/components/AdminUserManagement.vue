<template>
  <div class="admin-user-management">
    <h2>用户管理</h2>

    <h3>新增用户</h3>
    <input v-model="newUsername" placeholder="用户名" />
    <input v-model="newPassword" type="password" placeholder="初始密码" />
    <select v-model="newRole">
      <option value="admin">管理员</option>
      <option value="farmer">农夫</option>
      <option value="npc">村民</option>
      <option value="merfolk">人鱼</option>
      <option value="junimo">祝尼魔</option>
    </select>
    <button @click="createUser">创建用户</button>

    <h3>修改用户密码</h3>
    <input v-model="resetUsername" placeholder="用户名" />
    <input v-model="resetPassword" type="password" placeholder="新密码" />
    <button @click="resetUserPassword">重置密码</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const newUsername = ref("");
const newPassword = ref("");
const newRole = ref("farmer");
const resetUsername = ref("");
const resetPassword = ref("");

const createUser = async () => {
  await fetch("/api/admin/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: newUsername.value,
      password: newPassword.value,
      role: newRole.value,
    }),
  });
};

const resetUserPassword = async () => {
  await fetch("/api/admin/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: resetUsername.value,
      newPassword: resetPassword.value,
    }),
  });
};
</script>
