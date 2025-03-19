<template>
  <div class="admin-shop">
    <h2>管理员商店</h2>

    <h3>当前出售的商品</h3>
    <ul>
      <li v-for="item in shopItems" :key="item.id">
        {{ item.name }} - {{ item.price }} 金币（库存：{{ item.stock }}）
        <button @click="removeItem(item)">删除</button>
      </li>
    </ul>

    <h3>添加商品</h3>
    <select v-model="selectedItem">
      <option v-for="item in allItems" :key="item.id" :value="item.id">
        {{ item.name }}
      </option>
    </select>
    <input v-model="stock" type="number" placeholder="库存" />
    <input v-model="price" type="number" placeholder="价格" />
    <button @click="addItem">添加</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const shopItems = ref([]);
const allItems = ref([]);
const selectedItem = ref(null);
const stock = ref(1);
const price = ref(1);

// **获取管理员商店商品**
const fetchShopItems = async () => {
  const response = await fetch("/api/admin-shop");
  shopItems.value = await response.json();
};

// **获取所有可出售的物品**
const fetchAllItems = async () => {
  const response = await fetch("/api/items");
  allItems.value = await response.json();
};

// **添加商品**
const addItem = async () => {
  await fetch("/api/admin-shop/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      item_id: selectedItem.value,
      stock: stock.value,
      price: price.value,
    }),
  });
  fetchShopItems();
};

// **删除商品**
const removeItem = async (item) => {
  await fetch("/api/admin-shop/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_id: item.id }),
  });
  fetchShopItems();
};

onMounted(() => {
  fetchShopItems();
  fetchAllItems();
});
</script>

<style scoped>
.admin-shop {
  margin-top: 20px;
}
</style>
