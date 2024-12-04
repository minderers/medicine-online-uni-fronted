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
    <swiper-item v-for="(item, index) in tabBars" :key="index">
      <scroll-view scroll-y="true" :style="'height:' + scrollH + 'px;'">
        <Tag :categoryId="item.pkId" />
        <Banner v-if="index === 0 || index === 1 || index === 2" />
        <NewResource />
      </scroll-view>
    </swiper-item>
  </swiper>
  <div class="feedback mr-2 mb-2 font-weight-bold text-xl" @click="toFeedback">
    反馈
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Navbar from "@/components/navbar.vue";
import { onLoad } from "@dcloudio/uni-app";
import Banner from "./components/banner.vue";
import Tag from "./components/tag.vue";
import { queryByLevel, getCategoryListByParentId } from "@/service/tab";
import NewResource from "./components/newResource.vue";

const navIndex = ref(0);
const scrollH = ref(0); //滚动区域高度
const tabBars = ref([]);

onLoad(() => {
  uni.getSystemInfo({
    success: (res) => {
      console.log(res);
      scrollH.value = res.windowHeight - res.statusBarHeight;
    },
  });
});

const toFeedback = () => {
  uni.navigateTo({
    url: "/pages/index/feedback",
  });
};

const getTabList = async () => {
  const res = await queryByLevel();
  if (res.code === 0 && res.data) {
    tabBars.value = res.data;
  }
};

onMounted(() => {
  getTabList();
});

// 点击切换选项卡
const changeTab = async (index) => {
  navIndex.value = index;
  const categoryId = tabBars.value[index].pkId;
  const subcategories = await getCategoryListByParentId(categoryId);
  // 处理子分类数据，例如更新状态或渲染子分类
  console.log(subcategories);
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
.feedback {
  background: #32b880;
  border-radius: 50%;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 40rpx 30rpx;
  color: white;
}
</style>
