<template>
  <div class="mask w-30 h-20">
    <div class="flex justify-center align-center">
      <image
        src="../../../static/index/audio_pause.png"
        mode="scaleToFill"
        class="w-5 h-5"
      />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.mask {
  position: absolute; /* 绝对定位 */
  bottom: 0;
  width: 100%; /* 遮罩层宽度 */
  height: 100%; /* 遮罩层高度 */
  background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明背景 */
  /* 其他样式，如边框、圆角等 */
  border-radius: 10rpx;
}
.align-center {
  align-items: center;
  height: 100%;
}
</style>
