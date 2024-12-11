<template>
  <swiper
    indicator-dots="true"
    circular="true"
    indicator-active-color="#32b880"
    autoplay="true"
    class="h-55"
  >
    <swiper-item
      class="banner"
      @click="navigatorToMsg(item)"
      v-for="(item, index) in bannerList"
      :key="index"
    >
      <div class="item mx-2">
        <image :src="item.cover" alt="" class="banner-img" />
        <div class="mx-2" style="font-size: 35rpx">
          {{ item.title }}
        </div>
        <div class="bottom m-2">
          <div class="tag" :style="getRandomColor(item.pkId)">
            {{ item.label }}
          </div>
          <div class="icon">
            <div class="left">
              <image
                src="../../../static/index/icon_chakan.png"
                mode="scaleToFill"
              />
              <div class="text-gray-400 ml-2">{{ item.browseNum }}</div>
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
    </swiper-item>
  </swiper>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getPublicSubjectList } from "@/service/subject";
const bannerList = ref([]);
const getBannerList = async () => {
  const res = await getPublicSubjectList();
  if (res.code === 0 && res.data) {
    bannerList.value = res.data;
  }
};
onMounted(() => {
  getBannerList();
});
const navigatorToMsg = (item) => {
  uni.navigateTo({
    url: `/pages/index/banner-msg?pkId=${encodeURIComponent(
      item.pkId
    )}&cover=${encodeURIComponent(item.cover)}&brief=${encodeURIComponent(
      item.brief
    )}&claim=${encodeURIComponent(item.claim)}`,
  });
};
const getRandomColor = (index) => {
  const colors = ["red", "blue", "green", "orange", "purple"];
  const color = colors[index % colors.length]; // 使用索引来确保每个标签颜色不同
  return {
    borderColor: color,
    color: color, // 文字颜色和边框颜色相同
  };
};
</script>

<style lang="scss" scoped>
.banner {
  background: #fff;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.15);
  .banner-img {
    width: 100%;
    height: 250rpx;
    border-radius: 10px 10px 0 0;
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tag {
      padding: 2px;
      border-radius: 5px;
      border: 1px solid #f5a623;
      font-size: 20rpx;
      color: #f5a623;
      margin-bottom: 20rpx;
    }
    .icon {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
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
}
</style>
