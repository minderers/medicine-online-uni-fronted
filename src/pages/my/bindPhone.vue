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
      <input
        class="phone-number"
        type="text"
        placeholder="请输入手机号"
        v-model="phoneForm.phone"
      />
      <view class="line"></view>

      <view class="code">验证码</view>
      <view class="code-container">
        <input
          class="code-number"
          type="text"
          placeholder="请输入验证码"
          v-model="phoneForm.code"
        />
        <text class="getcode" @tap="sendPhoneCode" v-if="!timer"
          >获取验证码</text
        >
        <text class="getcode" v-else>还剩下{{ count }}秒</text>
      </view>

      <view class="line"></view>
    </view>

    <button class="button" @click="handleSubmit">认证</button>
  </view>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { updateUserPhone } from "@/service/user";
import { storeToRefs } from "pinia";
import userSendCodeFunction from "@/composables/userSendCode";
import { isCodeAvailable, isPhoneAvailable } from "@/utils/validate";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const token = uni.getStorageSync("token");

const back = () => {
  uni.navigateBack();
};
// 使⽤Hooks
const { count, timer, phoneForm, sendPhoneCode } = userSendCodeFunction();

const handleSubmit = async () => {
  // 1.⼿机号校验
  if (!phoneForm.phone || !isPhoneAvailable(phoneForm.phone)) {
    uni.showToast({
      title: "请输⼊正确的⼿机号码",
      icon: "none",
    });
    return;
  }
  // 2.验证码校验
  if (!phoneForm.code || !isCodeAvailable(phoneForm.code)) {
    uni.showToast({
      title: "请输⼊正确的验证码",
      icon: "none",
    });
    return;
  }
  // 处理事件
  const res = await updateUserPhone(phoneForm.phone, phoneForm.code);
  if (res.code === 0) {
    uni.showToast({
      title: "操作成功",
      icon: "success",
    });

    // userStore.userInfo.phone = phoneForm.phone;

    // 清除⽤户信息
    userStore.clearUserInfo();
    // 重定向到登录⻚⾯
    uni.reLaunch({
      url: "/pages/login/login",
    });
  } else {
    uni.showToast({
      title: res.msg,
      icon: "none",
    });
    return;
  }
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
  width: 100%; // 可以考虑改为固定像素值等，看效果
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
  color: #04964b;
}
.button {
  background-color: #00a651;
  color: white;
  margin-top: 160rpx;
  width: 400rpx;
}
</style>
