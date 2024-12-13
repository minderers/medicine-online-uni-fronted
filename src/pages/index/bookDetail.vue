<template>
  <Back>
    <slot>详情</slot>
  </Back>

  <div>{{ props.title }}</div>

  <div class="container">
    <!-- 使用 iframe 展示 PDF 文件 -->
    <web-view :src="fileUrl" class="inside"></web-view>
  </div>
</template>

<script setup>
import Back from "@/components/back.vue";
import { ref, defineProps, onMounted } from "vue";

// 定义 props，确保传入的参数类型正确
const props = defineProps({
  title: String,
  url: String, // url 应该是一个字符串类型
});

console.log(props.title); // 检查 title 是否正常
console.log(props.url); // 检查 url 是否正常

// 初始化 fileUrl 为一个空字符串
const fileUrl = ref("");

onMounted(() => {
  if (props.url) {
    fileUrl.value = `http://47.99.65.19/pdfplugin/web/viewer.html?file=${props.url}`;
    console.log(fileUrl.value); // 在 mounted 时检查 fileUrl 的值
  } else {
    console.error("没有传入有效的 URL");
  }
});
</script>

<style>
.container {
  width: 100%;
  height: 100vh; /* 使容器占满整个屏幕 */
  overflow: hidden;
}

.inside {
  width: 80%;
  height: 100%;
}
</style>
