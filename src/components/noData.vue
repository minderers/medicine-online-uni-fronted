<template>
  <view class="no-data">

    <image class="img" src="/static/images/noData.png" mode="aspectFit" />
    <text class="txt">还没有内容</text>
  </view>
</template>
<script setup></script>
<style lang="scss" scoped>
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20rpx;
  .img {
    width: 300rpx;
    height: 300rpx;
    .image {

      width: 100%;
      height: 100%;
    }
  }
  .txt {
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
