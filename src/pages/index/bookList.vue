<template>
  <div>
    <Back><slot>书籍列表</slot></Back>
    <div class="flex justify-between align-center mx-5 flex-wrap">
      <div v-for="item in bookList" :key="item.pkId">
        <div class="item my-2" @click="toBook(item)">
          <image :src="item.cover" mode="scaleToFill" class="h-50 w-40" />
          <view class="mask flex justify-end align-center h-5">
            <div class="left">
              <image
                src="../../static/index/icon_kan.png"
                mode="scaleToFill"
                class="h-3 w-4"
              />
            </div>
            <div class="text-xs text-white mx-2">{{ item.browseNum }}</div>
          </view>
        </div>
        <div class="text-center">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getSubjectBook } from "@/service/subject";
import Back from "@/components/back.vue";
const props = defineProps({
  pkId: Number,
});
const bookList = ref([]);
const getBookList = async () => {
  const res = await getSubjectBook(props.pkId);
  bookList.value = res.data;
};

const toBook = (item) => {
  const query = `title=${encodeURIComponent(
    item.title
  )}&url=${encodeURIComponent(item.url)}&bookId=${encodeURIComponent(
    item.pkId
  )}&cover=${encodeURIComponent(item.cover)}&totalPage=${encodeURIComponent(
    item.totalPage
  )}`;
  uni.navigateTo({
    url: `/pages/index/bookDetail?${query}`,
  });
};

onMounted(() => {
  getBookList();
});
</script>

<style lang="scss" scoped>
.item {
  position: relative;
}
.mask {
  position: absolute; /* 绝对定位 */
  bottom: 0;
  width: 100%; /* 遮罩层宽度 */ /* 遮罩层高度 */
  background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明背景 */
  /* 其他样式，如边框、圆角等 */
}
</style>
