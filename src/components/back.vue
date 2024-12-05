<template>
  <div class="h-15"></div>
  <div class="flex justify-between align-center banner bg-white mx-2">
    <div class="back" @click="back">
      <image
        src=".././static/icon_fanhui.png"
        style="height: 40rpx; width: 25rpx"
      />
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="null"></div>
  </div>
</template>

<script setup>
const back = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.icon {
  height: 40rpx;
  width: 25rpx;
}
.banner {
  height: 100rpx;
}
.content {
  font-size: 32rpx;
}
</style>
