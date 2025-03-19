<template>
  <div class="shop">
    <h2>{{ npcName }} 的商店</h2>
    <ul>
      <li v-for="item in shopItems" :key="item.item_id">
        {{ item.name }} - {{ item.price }} {{ currency }}
        <button @click="buyItem(item)">购买</button>
      </li>
    </ul>

    <div v-if="message" class="message">
      <p>{{ message }}</p>
      <button @click="message = ''">确认</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const npcId = route.params.npcId;
const npcName = ref("");
const shopItems = ref([]);
const message = ref("");
const currency = ref("金币");

// **获取 NPC 商店物品**
const fetchShopItems = async () => {
  const response = await fetch(`/api/shop/${npcId}`);
  const data = await response.json();
  shopItems.value = data.items;
  npcName.value = data.npc_name;
  currency.value = data.currency === "raisins" ? "葡萄干" : "金币";
};

// **购买物品**
const buyItem = async (item) => {
  const response = await fetch("/api/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      npcId: npcId,
      itemId: item.item_id,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    message.value = `成功购买 ${item.name}！`;
    item.stock--; // 库存减少
  } else {
    message.value = data.error;
  }
};

onMounted(fetchShopItems);
</script>

<style scoped>
.shop {
  text-align: center;
  margin-top: 20px;
}
button {
  margin: 5px;
  padding: 8px 16px;
  font-size: 14px;
}
.message {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
</style>
