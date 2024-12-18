<template>
  <view class="view bg">
    <view class="h-15"></view>
    <view class="flex justify-between align-center banner mx-2">
      <view class="back" @click="back">
        <image
          src="@/static/icon_fanhui.png"
          style="height: 40rpx; width: 25rpx"
        />
      </view>
      <view class="content">
        <slot>绑定手机</slot>
      </view>
      <view class="null"></view>
    </view>

    <view class="container">
      <view class="phone">手机号码</view>
      <view class="phone-number">15961520129</view>
      <view class="line"></view>

      <view class="code">验证码</view>
      <view class="code-container">
        <input class="code-number" placeholder="请输入验证码" />
        <text class="getcode">获取验证码</text>
      </view>

      <view class="line"></view>
    </view>

    <button class="button">认证</button>
  </view>
</template>

<script setup lang="ts">
const back = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.bg {
  background-image: url("https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/action_bg.png");
  background-size: cover;
  height: 100vh;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  z-index: -1;
}
.banner {
  height: 100rpx;
}
.content {
  font-size: 32rpx;
}

.container {
  margin: 70rpx 100rpx;
  font-size: 36rpx;
}
.phone-number {
  margin-top: 40rpx;
}
.line {
  border-bottom: 1px solid #e0e0e0;
  width: 80%;
}

.code {
  margin-top: 60rpx;
}
.code-container {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  margin-top: 40rpx;
}
.getcode {
  color: #00a651;
}
.button {
  background-color: #00a651;
  color: white;
  margin-top: 160rpx;
  width: 400rpx;
}
</style>
