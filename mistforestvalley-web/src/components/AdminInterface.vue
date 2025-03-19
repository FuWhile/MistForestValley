<template>
  <div class="admin-interface">
    <h2>管理员界面</h2>

    <!-- 进入不同管理模块的按钮 -->
    <h3>管理功能</h3>
    <button @click="goToUserManagement">用户管理</button>
    <button @click="goToItemManagement">物品管理</button>
    <button @click="goToUserDataManagement">用户数据管理</button>
    <button @click="goToNpcShopManagement">NPC 商店管理</button>

    <!-- 管理员个人商店（仍在当前界面） -->
    <h3>个人商店管理</h3>
    <button @click="goToAdminShop">进入个人商店</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToUserManagement = () => {
  router.push("/admin-user-management");
};

const goToItemManagement = () => {
  router.push("/admin-item-management");
};

const goToUserDataManagement = () => {
  router.push("/admin-user-data");
};

const goToNpcShopManagement = () => {
  router.push("/admin-npc-shop");
};

const goToAdminShop = () => {
  router.push("/admin-shop");
};
</script>

<style scoped>
.admin-interface {
  margin-top: 20px;
}
button {
  margin: 5px;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>

