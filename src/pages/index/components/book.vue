<template>
  <view class="container">
    <!-- 封面插槽 -->
    <view class="cover">
      <slot name="cover"></slot>
      <view class="browse">
        <view class="fr">
          <slot name="browseNum"></slot>
        </view>
      </view>
    </view>
    <!-- 书籍标题插槽 -->
    <view class="title">
      <slot name="title"></slot>
    </view>
  </view>
</template>

<style>
.container {
  width: 150rpx;
  height: 250rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 分布容器内的子元素 */
  overflow: hidden; /* 防止子元素溢出 */
}

.cover {
  width: 100%;
  height: 200rpx;
  position: relative;
}

.browse {
  background-color: #000;
  opacity: 0.4;
  color: #fff;
  position: relative;
  top: -50rpx;
  height: 40rpx;
  width: 140rpx;
  font-size: 20rpx;
  padding-top: 10rpx;
  padding-right: 10rpx;
}

.fr {
  float: right;
}

.title {
  font-size: 25rpx;
  margin-top: 10rpx;
  padding: 0 10rpx;
  overflow: hidden;
  text-overflow: ellipsis; /* 超出显示省略号 */
  white-space: nowrap; /* 防止标题换行 */
}
</style>
