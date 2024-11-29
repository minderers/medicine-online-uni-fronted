<template>
  <div class="nav">
    <div class="text-white text-center title">江苏中医在线</div>
    <div
      class="bg-white mt-10 mx-15 p-2 text-gray-400 sousuo"
      @click="navigatorToSearch"
    >
      <image
        src="../static/nav/icon_sousuo.png"
        mode="scaleToFill"
        class="icon mx-2"
      />
      <span>输入关键字搜索</span>
    </div>
  </div>
</template>

<script setup>
import ref from "vue";
const navigatorToSearch = () => {
  uni.navigateTo({
    url: "/pages/search/search",
  });
};
</script>

<style lang="scss" scoped>
.nav {
  background-image: url(../static/nav/bg_1.png);
  background-size: cover;
  height: 350rpx;
}
.title {
  font-size: 40rpx;
  padding-top: 100rpx;
  font-weight: bold;
}
.sousuo {
  border-radius: 50rpx;
}
.icon {
  width: 40rpx;
  height: 40rpx;
}
</style>
