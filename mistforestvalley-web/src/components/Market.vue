<template>
  <div class="market">
    <h2>集市</h2>
    <ul>
      <li v-for="npc in npcs" :key="npc.id">
        <button @click="openShop(npc.id)">{{ npc.name }} 的商店</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const npcs = ref([]);

// 获取所有 NPC 商店信息
const fetchNpcs = async () => {
  const response = await fetch("/api/npcs");
  npcs.value = await response.json();
};

const openShop = (npcId) => {
  router.push(`/shop/${npcId}`);
};

onMounted(fetchNpcs);
</script>

<style scoped>
.market {
  text-align: center;
  margin-top: 20px;
}
button {
  margin: 5px;
  padding: 8px 16px;
  font-size: 14px;
}
</style>
