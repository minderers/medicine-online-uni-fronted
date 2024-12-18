<template>
  <Back><slot>使用手册</slot></Back>
  <!-- 使用 rich-text 组件渲染 HTML 内容 -->
  <rich-text :nodes="HTMLcontent"></rich-text>
</template>

<script setup>
import Back from "@/components/back.vue";
import { ref, defineProps, onMounted } from "vue";
import { getSystem } from "@/service/user";

const props = defineProps({
  pkId: Number,
});

const HTMLcontent = ref("");
const content = ref([]);

const getSystemDetail = async () => {
  try {
    const res = await getSystem(props.pkId);
    console.log(res);
    const contentWithHandledSpaces = res.data.replace(
      /　/g,
      '<span data-text="　"></span>'
    );
    HTMLcontent.value = contentWithHandledSpaces;
    // // 将 HTML 字符串转换为 rich-text 组件可以接受的格式
    // content.value = convertHtmlToNodes(HTMLcontent.value);
  } catch (error) {
    console.error("获取系统信息失败：", error);
    // 可以在这里根据项目需求，进行一些提示用户的操作，比如弹出提示框等
  }
};

onMounted(() => {
  getSystemDetail();
});
</script>
<style lang="scss" scoped></style>
