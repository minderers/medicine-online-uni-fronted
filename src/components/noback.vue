<template>
  <div class="h-15"></div>
  <div class="flex justify-center align-center banner bg-white mx-2">
    <div class="content text-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup></script>

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
