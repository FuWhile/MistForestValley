<template>
  <div class="user-center">
    <header>
      <h1>欢迎, {{ username }}</h1>
      <p>当前余额：{{ money }} 金币</p>
      <Inventory :items="inventory" />  <!-- 显示物品背包 -->
    </header>

    <!-- 根据用户角色显示不同的内容 -->
    <div v-if="role === 'admin'">
      <AdminInterface />  <!-- 管理员界面 -->
    </div>
    <div v-else-if="role === 'farmer'">
      <FarmerInterface />  <!-- 农夫界面 -->
    </div>
    <div v-else-if="role === 'npc'">
      <NpcInterface />  <!-- 村民界面 -->
    </div>
    <div v-else-if="role === 'merfolk'">
      <MerfolkInterface />  <!-- 人鱼界面 -->
    </div>
    <div v-else-if="role === 'junimo'">
      <JunimoInterface />  <!-- 祝尼魔界面 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminInterface from './AdminInterface.vue';  // 管理员界面组件
import FarmerInterface from './FarmerInterface.vue';  // 农夫界面组件
import NpcInterface from './NpcInterface.vue';  // 村民界面组件
import MerfolkInterface from './MerfolkInterface.vue';  // 人鱼界面组件
import JunimoInterface from './JunimoInterface.vue';  // 祝尼魔界面组件
import Inventory from './Inventory.vue';  // 物品背包组件

const username = ref('');  // 用户名
const money = ref(100);  // 用户金钱
const inventory = ref([]);  // 用户物品
const role = ref('');  // 用户角色

// 假设这里从 Vuex 或 API 获取数据
onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    const router = useRouter();
    router.push("/");  // 如果没有 token，重定向到登录页面
    return;
  }

  // 通过 API 获取用户信息（例如角色、金钱、物品等）
  // 这里假设你有一个 API 获取用户数据
  const data = {
    username: '测试用户',  // 从 API 返回的用户名
    role: 'admin',  // 从 API 返回的角色
    money: 150,  // 用户金钱
    inventory: []  // 物品背包
  };

  username.value = data.username;
  role.value = data.role;
  money.value = data.money;
  inventory.value = data.inventory;
});
</script>

<style scoped>
.user-center {
  padding: 20px;
}
</style>
