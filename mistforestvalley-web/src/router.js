import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import ChangePassword from './components/ChangePassword.vue';
import UserCenterAdmin from './components/UserCenterAdmin.vue';
import UserCenterFarmer from './components/UserCenterFarmer.vue';
import UserCenterNPC from './components/UserCenterNPC.vue';
import UserCenterMerfolk from './components/UserCenterMerfolk.vue';
import UserCenterJunimo from './components/UserCenterJunimo.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/home', component: Home },
  { path: '/change-password', component: ChangePassword },
  { path: '/user-center/admin', component: UserCenterAdmin },
  { path: '/user-center/farmer', component: UserCenterFarmer },
  { path: '/user-center/npc', component: UserCenterNPC },
  { path: '/user-center/merfolk', component: UserCenterMerfolk },
  { path: '/user-center/junimo', component: UserCenterJunimo }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


