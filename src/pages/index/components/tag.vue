<template>
  <div class="tag-container flex">
    <div
      v-for="subcategory in subcategories"
      :key="subcategory.pkId"
      class="subcategory"
    >
      <div class="item m-2 px-2 py-1 text-white">
        {{ subcategory.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, defineProps } from "vue";
import { getCategoryListByParentId } from "@/service/tab";

const props = defineProps({
  categoryId: {
    type: Number,
    required: true,
  },
});

const subcategories = ref([]);

// 使用 watchEffect 自动侦听 props.categoryId 的变化
watchEffect(async () => {
  if (props.categoryId) {
    try {
      const res = await getCategoryListByParentId(props.categoryId);
      console.log("Received categoryId:", props.categoryId);
      if (res.code === 0 && Array.isArray(res.data)) {
        subcategories.value = res.data;
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }
});
</script>

<style scoped>
.item {
  background: #32b880;
  border-radius: 10rpx;
}
</style>
