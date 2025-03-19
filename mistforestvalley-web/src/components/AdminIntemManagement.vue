<template>
  <div class="admin-item-management">
    <h2>物品管理</h2>

    <h3>新增物品</h3>
    <input v-model="newItem.name" placeholder="物品名称" />
    <input v-model="newItem.image_id" placeholder="图片 ID" />

    <label>物品类型</label>
    <select v-model="newItem.type">
      <option value="crop">农作物</option>
      <option value="product">农产品</option>
      <option value="forage">采集品</option>
      <option value="fish">鱼类</option>
      <option value="monster">怪物</option>
      <option value="item">物品</option>
      <option value="recipe">食谱</option>
      <option value="book">书籍</option>
    </select>

    <h4>基础属性</h4>
    <input v-model="newItem.sell_price" placeholder="收购价格" />
    <input v-model="newItem.npc_price" placeholder="NPC 售价" />

    <h4 v-if="newItem.type === 'crop' || newItem.type === 'forage' || newItem.type === 'fish'">季节相关</h4>
    <input v-if="newItem.type === 'crop' || newItem.type === 'forage' || newItem.type === 'fish'" v-model="newItem.season" placeholder="所属季节" />

    <h4 v-if="newItem.type === 'crop'">生长周期</h4>
    <input v-if="newItem.type === 'crop'" v-model="newItem.growth_cycle" placeholder="生长周期（天）" />

    <h4>描述</h4>
    <textarea v-model="newItem.description" placeholder="简介"></textarea>
    <textarea v-model="newItem.research" placeholder="深入研究"></textarea>

    <button @click="addItem">添加物品</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const newItem = ref({
  name: "",
  image_id: "",
  type: "item",
  sell_price: 0,
  npc_price: 0,
  season: "",
  growth_cycle: "",
  description: "",
  research: "",
});

const addItem = async () => {
  await fetch("/api/admin/add-item", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem.value),
  });
};
</script>
