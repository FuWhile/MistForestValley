<template>
  <div class="farmer-interface">
    <h2>农夫界面</h2>
    <p>金币: {{ money }}</p>
    <p>葡萄干: {{ raisins }}</p>

    <h3>背包</h3>
    <ul>
      <li v-for="item in backpack" :key="item.id">
        {{ item.name }} (数量: {{ item.quantity }})
      </li>
    </ul>

    <h3>技能经验</h3>
    <ul>
      <li>战斗: {{ combat }}</li>
      <li>挖矿: {{ mining }}</li>
      <li>钓鱼: {{ fishing }}</li>
      <li>种地: {{ farming }}</li>
      <li>采集: {{ foraging }}</li>
    </ul>

    <h3>NPC 好感度</h3>
    <ul>
      <li v-for="npc in npcsWithAffection" :key="npc.id">
        {{ npc.name }}：{{ npc.affection }} ❤ ({{ Math.floor(npc.affection / 250) }} 心)
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const money = ref(0);
const raisins = ref(0);
const combat = ref(0);
const mining = ref(0);
const fishing = ref(0);
const farming = ref(0);
const foraging = ref(0);
const backpack = ref([]);
const npcs = ref([]);

// **从服务器获取农夫数据**
const fetchFarmerData = async () => {
  const response = await fetch("/api/farmer/data");
  const data = await response.json();
  money.value = data.gold;
  raisins.value = data.raisins;
  combat.value = data.combat_xp;
  mining.value = data.mining_xp;
  fishing.value = data.fishing_xp;
  farming.value = data.farming_xp;
  foraging.value = data.foraging_xp;
  backpack.value = data.backpack;
};

// **从服务器获取 NPC 好感度**
const fetchNpcAffection = async () => {
  const response = await fetch("/api/farmer/npc-affection");
  npcs.value = await response.json();
};

// **只显示好感度大于 1 的 NPC**
const npcsWithAffection = computed(() => {
  return npcs.value.filter((npc) => npc.affection > 1);
});

onMounted(() => {
  fetchFarmerData();
  fetchNpcAffection();
});
</script>

<style scoped>
.farmer-interface {
  margin-top: 20px;
}
</style>

