<template>
  <div class="admin-npc-shop">
    <h2>NPC 商店管理</h2>

    <h3>选择 NPC</h3>
    <select v-model="selectedNpc">
      <option v-for="npc in npcs" :key="npc.id" :value="npc.id">
        {{ npc.name }}
      </option>
    </select>

    <h3>选择物品</h3>
    <select v-model="selectedItem">
      <option v-for="item in items" :key="item.id" :value="item.id">
        {{ item.name }}
      </option>
    </select>

    <input v-model="stock" type="number" placeholder="库存数量" />
    <input v-model="price" type="number" placeholder="出售价格" />
    <button @click="addNpcItem">添加物品</button>

    <h3>当前 NPC 商店</h3>
    <ul>
      <li v-for="item in npcShopItems" :key="item.id">
        {{ item.name }} - {{ item.price }} 金币（库存：{{ item.stock }}）
        <input v-model="item.newStock" type="number" placeholder="修改库存" />
        <input v-model="item.newPrice" type="number" placeholder="修改价格" />
        <button @click="updateItem(item)">更新</button>
        <button @click="removeItem(item)">移除</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const npcs = ref([]);
const items = ref([]);
const npcShopItems = ref([]);
const selectedNpc = ref(null);
const selectedItem = ref(null);
const stock = ref(1);
const price = ref(1);

const fetchNpcs = async () => {
  const response = await fetch("/api/admin/get-npcs");
  npcs.value = await response.json();
};

const fetchItems = async () => {
  const response = await fetch("/api/items");
  items.value = await response.json();
};

onMounted(() => {
  fetchNpcs();
  fetchItems();
});
</script>

