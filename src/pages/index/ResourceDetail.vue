<template>
  <div>
    <Back>
      <slot>详情</slot>
    </Back>
    <div class="video">
      <video
        id="myVideo"
        :src="src"
        :controls="controls"
        :autoplay="autoplay"
        :muted="muted"
        show-mute-btn
        auto-pause-if-open-native="false"
        style="width: 100%; height: 300px"
      ></video>
    </div>
    <view
      ref="tabBar"
      class="flex pt-3 px-3 bg-white justify-start font-weight-bold text-gray-400"
    >
      <view
        v-for="(item, index) in tabBars"
        :key="index"
        :class="navIndex === index ? 'activite' : ''"
        class="pb-2 ml-4"
        @click="changeTab(index)"
      >
        {{ item.name }}
      </view>
    </view>
    <swiper
      :current="navIndex"
      :duration="150"
      @change="onChangeTab"
      :style="'height:' + scrollH + 'px;padding-bottom:50px'"
    >
      <!-- 简介 -->
      <swiper-item>
        <scroll-view scroll-y="true">
          <div class="text-xl text-center font-weight-bold">{{ title }}</div>
          <div class="icon my-2 justify-end">
            <div class="left">
              <image
                src="../../static/index/icon_chakan.png"
                mode="scaleToFill"
              />
              <div class="text-gray-400 ml-2">{{ viewNum }}</div>
            </div>
            <div class="right">
              <image
                src="../../static/index/icon_shoucang.png"
                mode="scaleToFill"
              />
              <div class="text-gray-400 mx-2">{{ starNum }}</div>
            </div>
          </div>
          <div class="my-2">
            <div class="section ml-2 px-2 font-weight-bold">视频介绍</div>
            <div class="text-gray-500 ml-20 my-3">{{ title }}</div>
          </div>
        </scroll-view>
      </swiper-item>
      <!-- 目录 -->
      <swiper-item>
        <scroll-view scroll-y="true">
          <div class="m-4" v-for="(item, index) in list" :key="index">
            <div class="item flex justify-between my-2">
              <div class="text-xl">
                {{ item.title }}
              </div>
              <div class="second text-gray-400 text-sm">{{ item.second }}</div>
            </div>
          </div>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script setup>
import Back from "@/components/back.vue";
import { ref, defineProps } from "vue";
const navIndex = ref(0);
const isletIndex = ref(0);
const tabBars = ref([{ name: "简介" }, { name: "目录" }]);
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
const list = ref([
  { title: "第一章", second: "0'00'8" },
  { title: "第二章", second: "0'00'50" },
]);
const props = defineProps({
  title: String,
  viewNum: Number,
  starNum: Number,
});
const src = ref(
  "https://share-app-api.oss-cn-nanjing.aliyuncs.com/20241201_184846.mp4"
);
const controls = ref(true);
const autoplay = ref(false);
const muted = ref(false);
</script>

<style lang="scss" scoped>
.section {
  border-left: #32b880 solid 12rpx;
  border-radius: 10rpx;
}
.activite {
  color: #32b880;
  border-bottom: #32b880 solid 4rpx;
}

.icon {
  display: flex;
  align-items: center;
  .left,
  .right {
    display: flex;
    align-items: center;
    margin-left: 10px;
    .number {
      margin-left: 5px;
    }
  }
  image {
    width: 40rpx;
    height: 30rpx;
  }
}
</style>
