<template>
  <div class="home">
    <h1>欢迎来到 Mist Forest Valley</h1>
    <button @click="goToProfile">个人主页</button>
    <button @click="goToMarket">集市</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToProfile = () => {
  router.push("/profile");
};

const goToMarket = () => {
  router.push("/market");
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
