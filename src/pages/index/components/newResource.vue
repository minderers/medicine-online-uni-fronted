<template>
  <div v-for="(item, index) in radioList" :key="index" class="mt-5">
    <div class="item mx-2 flex justify-between" @click="toDetail(item)">
      <div class="">
        <image :src="item.cover" class="w-30 h-20 cover" />
      </div>
      <div class="right ml-2 w-30">
        <div class="text-lg">{{ item.title }}</div>
        <div class="tag mt-9">{{ item.label }}</div>
      </div>
      <div class="bottom mt-15 mr-4">
        <div class="icon">
          <div class="left">
            <image
              src="../../../static/index/icon_chakan.png"
              mode="scaleToFill"
            />
            <div class="text-gray-400 ml-2">{{ item.viewNum }}</div>
          </div>
          <div class="right">
            <image
              src="../../../static/index/icon_shoucang.png"
              mode="scaleToFill"
            />
            <div class="text-gray-400 mx-2">{{ item.starNum }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ResourceDetail from "../ResourceDetail.vue";
const toDetail = (item) => {
  uni.navigateTo({
    url: `/pages/index/ResourceDetail?title=${encodeURIComponent(
      item.title
    )}&viewNum=${encodeURIComponent(item.viewNum)}&starNum=${encodeURIComponent(
      item.starNum
    )}`,
  });
};
const radioList = ref([
  {
    cover:
      "https://share-app-api.oss-cn-nanjing.aliyuncs.com/3b10b547-f110-4d80-8a35-5ab9f0ce7288.jpg",
    title: "父亲标题",
    label: "父亲标签",
    viewNum: 100,
    starNum: 100,
  },
  {
    cover:
      "https://share-app-api.oss-cn-nanjing.aliyuncs.com/3b10b547-f110-4d80-8a35-5ab9f0ce7288.jpg",
    title: "标题",
    label: "标签",
    viewNum: 100,
    starNum: 100,
  },
  {
    cover:
      "https://share-app-api.oss-cn-nanjing.aliyuncs.com/3b10b547-f110-4d80-8a35-5ab9f0ce7288.jpg",
    title: "标题",
    label: "标签",
    viewNum: 100,
    starNum: 100,
  },
  {
    cover:
      "https://share-app-api.oss-cn-nanjing.aliyuncs.com/3b10b547-f110-4d80-8a35-5ab9f0ce7288.jpg",
    title: "标题",
    label: "标签",
    viewNum: 100,
    starNum: 100,
  },
  {
    cover:
      "https://share-app-api.oss-cn-nanjing.aliyuncs.com/3b10b547-f110-4d80-8a35-5ab9f0ce7288.jpg",
    title: "标题",
    label: "标签",
    viewNum: 100,
    starNum: 100,
  },
  {
    cover:
      "https://share-app-api.oss-cn-nanjing.aliyuncs.com/3b10b547-f110-4d80-8a35-5ab9f0ce7288.jpg",
    title: "标题",
    label: "标签",
    viewNum: 100,
    starNum: 100,
  },
]);
</script>

<style lang="scss" scoped>
.item {
  border-bottom: 1rpx solid #e5e5e5;
  width: 100%;
}
.cover {
  border-radius: 10rpx;
}
.tag {
  width: 80rpx;
  text-align: center;
  padding: 0 10rpx;
  border-radius: 5px;
  border: 1px solid #f5a623;
  font-size: 20rpx;
  color: #f5a623;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
}
</style>
