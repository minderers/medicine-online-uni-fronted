<template>
  <Navbar />
  <!-- 头部选项卡 -->
  <view
    ref="tabBar"
    class="flex pt-3 px-6 bg-white justify-between font-weight-bold text-gray-400"
  >
    <view
      v-for="(item, index) in tabBars"
      :key="index"
      :class="navIndex === index ? 'activite' : ''"
      class="pb-2"
      @click="changeTab(index)"
    >
      {{ item.name }}
    </view>
  </view>
  <!-- 内容切换 -->
  <swiper
    :current="navIndex"
    :duration="150"
    @change="onChangeTab"
    :style="'height:' + scrollH + 'px;padding-bottom:50px'"
  >
    <!-- 上新资源 -->
    <swiper-item>
      <scroll-view scroll-y="true" :style="'height:' + scrollH + 'px;'">
        <Banner />
      </scroll-view>
    </swiper-item>
    <!-- 资讯 -->
    <swiper-item>
      <scroll-view scroll-y="true" :style="'height:' + scrollH + 'px;'"
        ><Banner
      /></scroll-view>
    </swiper-item>
    <!-- 学习 -->
    <swiper-item>
      <scroll-view scroll-y="true" :style="'height:' + scrollH + 'px;'"
        ><Banner
      /></scroll-view>
    </swiper-item>
    <!-- 知识库 -->
    <swiper-item>
      <scroll-view scroll-y="true" :style="'height:' + scrollH + 'px;'"
        >4</scroll-view
      >
    </swiper-item>
    <!-- 考核 -->
    <swiper-item>
      <scroll-view scroll-y="true" :style="'height:' + scrollH + 'px;'"
        >5</scroll-view
      >
    </swiper-item>
  </swiper>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "@/components/navbar.vue";
import { onLoad } from "@dcloudio/uni-app";
import Banner from "./components/banner.vue";
const navIndex = ref(0);
const isletIndex = ref(0);
const scrollH = ref(0); //滚动区域高度

onLoad(() => {
  uni.getSystemInfo({
    success: (res) => {
      console.log(res);
      scrollH.value = res.windowHeight - res.statusBarHeight;
    },
  });
});
const tabBars = ref([
  { name: "上新资源" },
  { name: "资讯" },
  { name: "学习" },
  { name: "知识库" },
  { name: "考核" },
]);
// 点击切换选项卡
const changeTab = (index) => {
  navIndex.value = index;
};
const checkIndex = (index) => {
  isletIndex.value = index;
};
// 滑动切换选项卡
const onChangeTab = (e) => {
  navIndex.value = e.detail.current;
};
</script>

<style scoped>
.activite {
  color: #32b880;
  border-bottom: #32b880 solid 4rpx;
}
</style>
