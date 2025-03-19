import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';  // 登录页面
import Home from '../components/Home.vue';   // 主页
import Admin from '../components/UserCenterAdmin.vue';
import Farmer from '../components/UserCenterFarmer.vue';
import NPC from '../components/UserCenterNPC.vue';
import Merfolk from '../components/UserCenterMerfolk.vue';
import Junimo from '../components/UserCenterJunimo.vue';
import ChangePassword from '../components/ChangePassword.vue';

const routes = [
  { path: '/', component: Login }, 
  { path: '/home', component: Home },
  { path: '/change-password', component: ChangePassword },
  { path: '/user-center/admin', component: Admin },
  { path: '/user-center/farmer', component: Farmer },
  { path: '/user-center/npc', component: NPC },
  { path: '/user-center/merfolk', component: Merfolk },
  { path: '/user-center/junimo', component: Junimo }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

