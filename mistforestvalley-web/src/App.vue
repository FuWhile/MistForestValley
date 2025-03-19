<template>
  <div id="app">
    <h1>欢迎回到雾森谷：Mist Forest Valley</h1>
    <!-- 
      重要：使用 <router-view /> 来渲染当前路由匹配到的组件。
      当你访问 / 时，会显示 Login.vue
      当你访问 /home 时，会显示 Home.vue
      ...
    -->
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

