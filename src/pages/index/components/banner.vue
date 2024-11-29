<template>
  <div class="banner" @click="navigatorToMsg">
    <image src="../../../static/index/banner.png" alt="" class="banner-img" />
    <div class="mx-2" style="font-size: 35rpx">
      基层卫生技术人员中医药知识与技能培训
    </div>
    <div class="bottom m-2">
      <div class="tag">中医培训</div>
      <div class="icon">
        <div class="left">
          <image
            src="../../../static/index/icon_chakan.png"
            mode="scaleToFill"
          />
          <div class="text-gray-400 ml-2">{{ viewCount }}</div>
        </div>
        <div class="right">
          <image
            src="../../../static/index/icon_shoucang.png"
            mode="scaleToFill"
          />
          <div class="text-gray-400 mx-2">1</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const viewCount = ref(908763);
const navigatorToMsg = () => {
  viewCount.value++;
  uni.navigateTo({
    url: "/pages/index/banner-msg",
  });
};
</script>

<style lang="scss" scoped>
.banner {
  background: #fff;
  border-radius: 10px;
  margin: 10px;
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
