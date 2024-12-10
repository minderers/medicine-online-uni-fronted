<template>
  <view class="container">
    <view class="cover">
      <slot name="cover"></slot>
    </view>

    <view class="text-container">
      <view class="title">
        <slot name="title"></slot>
      </view>
      <view class="label">
        <slot name="label"></slot>
      </view>
    </view>
  </view>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: row;
}

.cover {
  flex-shrink: 0;
  margin-right: 20rpx;
}

.text-container {
  display: flex;
  flex-direction: column;
  width: 500rpx;
}

.title {
  font-size: 25rpx;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.5;
  height: 100rpx;
}

.label {
  font-size: 22rpx;
  color: orange;
  margin-top: 8rpx;
  word-wrap: break-word;
  white-space: normal;
  line-height: 1.5;
  border: 2rpx solid orange;
  width: 100rpx;
  height: 35rpx;
  padding: 2rpx;
  border-radius: 15rpx;
  text-align: center;
}
</style>
