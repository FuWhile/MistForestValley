<template>
  <div id="app">
    <h1>欢迎回到雾森谷：Mist Forest Valley</h1>
    <p>当前路由：{{ $route.path }}</p> <!-- 添加显示当前路径 -->
    <router-view />
  </div>
</template>

<script setup>
// 这里可以暂时不需要任何脚本逻辑
</script>

<style>
h1 {
  text-align: center;
  margin-top: 50px;
}
</style>

