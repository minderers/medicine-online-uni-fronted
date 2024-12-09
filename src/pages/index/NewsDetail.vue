<template>
  <Back>
    <slot>详情</slot>
  </Back>
  <!-- 使用 rich-text 组件渲染 HTML 内容 -->
  <rich-text :nodes="content"></rich-text>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import Back from "../../components/back.vue";
import { getNewsDetail } from "@/service/news";

const props = defineProps({
  pkId: Number,
});

// 使用 ref 创建响应式数据对象
const HTMLcontent = ref("");
const content = ref([]);

// 获取详情内容并处理
const getDetail = async () => {
  const res = await getNewsDetail(props.pkId);
  console.log(res);
  HTMLcontent.value = res.data.content;

  // 将 HTML 字符串转换为 rich-text 组件可以接受的格式
  content.value = convertHtmlToNodes(HTMLcontent.value);
};

onMounted(() => {
  getDetail();
});

// 将 HTML 字符串转换为 rich-text 组件的节点数组
function convertHtmlToNodes(html) {
  // 简单的 HTML 净化逻辑，去除 script 标签和 onXXX 事件处理器
  const purifiedHtml = purifyHtml(html);

  const nodes = [];
  // 使用正则表达式匹配所有标签，并处理行内样式
  const tagRegex = /<(\w+)([^>]*)>(.*?)<\/\1>/gi;
  let match;
  while ((match = tagRegex.exec(purifiedHtml)) !== null) {
    const tag = match[1];
    const attrs = match[2];
    const text = match[3].trim();

    if (tag === "p" || tag === "span") {
      // 提取行内样式
      const styleMatch = attrs.match(/style="([^"]*)"/);
      const style = styleMatch ? styleMatch[1] : "";

      // 根据标签和样式创建节点
      nodes.push({
        type: "text",
        text: text,
        style: styleToRichTextStyle(style),
      });
    } else if (tag === "br") {
      nodes.push({
        type: "text",
        text: "\n",
      });
    }
  }

  return nodes;
}

// 将行内样式转换为 rich-text 组件的样式格式
function styleToRichTextStyle(style) {
  const styles = style.split(";").reduce((acc, curr) => {
    const [key, value] = curr.split(":").map((s) => s.trim());
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return styles;
}

// 简单的 HTML 净化函数，移除 script 标签和 onXXX 事件处理器
function purifyHtml(html) {
  return html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/g, "") // 移除 script 标签
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/g, "") // 移除 style 标签
    .replace(/on[a-z]+\s*=\s*"[^"]*"/g, "") // 移除 onXXX 事件处理器
    .replace(/on[a-z]+\s*=\s*'[^']*'/g, ""); // 移除 onXXX 事件处理器
}
</script>

<style lang="scss" scoped>
/* 你可以在这里根据需要编写额外的样式 */
</style>
