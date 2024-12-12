<template>
  <Back>问答列表</Back>
  <view v-if="loading">加载中...</view>
  <view v-else-if="error">发生错误: {{ error }}</view>
  <view v-else>
    <view v-for="topic in topics" :key="topic.pkId">{{ topic.content }}</view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Back from "@/components/back.vue";
import { getTopicListById } from "@/service/ask";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const topics = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await getTopicListById(props.id);
    topics.value = response.data; // 假设响应的数据存储在response.data中
  } catch (err) {
    error.value = err.message || "无法获取数据";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
