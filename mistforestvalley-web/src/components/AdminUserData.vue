<template>
  <div class="admin-user-data">
    <h2>用户数据管理</h2>

    <h3>修改用户数值</h3>
    <input v-model="targetUser" placeholder="用户名" />
    <input v-model="targetValue" placeholder="修改数值" />
    <button @click="modifyUserValue">修改</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const targetUser = ref("");
const targetValue = ref("");

const modifyUserValue = async () => {
  alert(`修改 ${targetUser.value} 的数值为 ${targetValue.value}`);
};
</script>

<style scoped>
.admin-user-data {
  margin-top: 20px;
}
button {
  margin: 5px;
}
</style>
