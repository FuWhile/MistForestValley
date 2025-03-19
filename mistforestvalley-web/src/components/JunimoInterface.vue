<template>
  <div class="junimo-interface">
    <h2>祝尼魔商店（葡萄干交易）</h2>

    <!-- 选择商品购买 -->
    <h3>商店</h3>
    <select v-model="selectedItem">
      <option v-for="item in availableItems" :key="item.id" :value="item">
        {{ item.name }} - {{ item.price }} 葡萄干
      </option>
    </select>
    <button @click="buyItem">购买</button>

    <h3>商店库存</h3>
    <ul>
      <li v-for="item in shopItems" :key="item.id">
        {{ item.name }} - {{ item.price }} 葡萄干
      </li>
    </ul>

    <!-- 祝尼魔管理农夫好感度 -->
    <h3>管理农夫好感度</h3>
    <select v-model="selectedFarmer">
      <option v-for="farmer in farmers" :key="farmer.id" :value="farmer">
        {{ farmer.name }}（当前好感：{{ Math.floor(farmer.affection / 250) }}❤）
      </option>
    </select>
    <input type="number" v-model="selectedFarmer.newAffection" placeholder="调整好感" />
    <button @click="updateAffection">更新好感</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 祝尼魔商店 & 好感度
const selectedItem = ref(null);
const selectedFarmer = ref(null);
const availableItems = ref([]); // 可购买物品
const shopItems = ref([]); // 祝尼魔商店库存
const farmers = ref([]); // 农夫列表

// **获取商店物品**
const fetchShopItems = async () => {
  const response = await fetch("/api/junimo/shop");
  shopItems.value = await response.json();
};

// **获取可购买物品**
const fetchAvailableItems = async () => {
  const response = await fetch("/api/items");
  availableItems.value = await response.json();
};

// **获取农夫列表**
const fetchFarmers = async () => {
  const response = await fetch("/api/junimo/farmers");
  farmers.value = await response.json();
};

const buyItem = async () => {
  if (!selectedItem.value) {
    alert("请选择物品！");
    return;
  }
  const response = await fetch("/api/junimo/buy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_id: selectedItem.value.id }),
  });
  const result = await response.json();
  alert(result.message);
  fetchShopItems(); // 刷新商店数据
};

const updateAffection = async () => {
  if (!selectedFarmer.value) {
    alert("请选择一个农夫！");
    return;
  }
  const response = await fetch("/api/junimo/update-affection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ farmer_id: selectedFarmer.value.id, affection: selectedFarmer.value.newAffection }),
  });
  const result = await response.json();
  alert(result.message);
  fetchFarmers(); // 刷新农夫好感度
};

onMounted(() => {
  fetchShopItems();
  fetchAvailableItems();
  fetchFarmers();
});
</script>

<style scoped>
.junimo-interface {
  margin-top: 20px;
}
</style>

