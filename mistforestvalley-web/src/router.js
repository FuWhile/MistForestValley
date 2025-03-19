import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';  // 登录组件
import ChangePassword from './components/ChangePassword.vue';  // 修改密码组件
import UserCenterAdmin from './components/UserCenterAdmin.vue';  // 管理员用户中心
import UserCenterFarmer from './components/UserCenterFarmer.vue';  // 农夫用户中心
import UserCenterNpc from './components/UserCenterNpc.vue';  // 村民用户中心
import UserCenterMerfolk from './components/UserCenterMerfolk.vue';  // 人鱼用户中心
import UserCenterJunimo from './components/UserCenterJunimo.vue';  // 祝尼魔用户中心

const routes = [
  { path: '/', component: Login },  // 登录页面
  { path: '/change-password', component: ChangePassword },  // 修改密码页面
  { path: '/user-center/admin', component: UserCenterAdmin },
  { path: '/user-center/farmer', component: UserCenterFarmer },
  { path: '/user-center/npc', component: UserCenterNpc },
  { path: '/user-center/merfolk', component: UserCenterMerfolk },
  { path: '/user-center/junimo', component: UserCenterJunimo },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

