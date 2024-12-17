<template>
  <Back><slot>个人资料</slot></Back>

  <view class="userInfoPage">
    <view class="user-info ml-30rpx">
      <view class="content">
        <text class="left">头像</text>
        <text class="right" @tap="onAvatarChange"> </text>
        <!-- <view class="img">
              <image :src="myUserInfo.avatar" mode="aspectFill" />
            </view> -->
        <image
          src="@/static/images/avatar.jpg"
          mode="scaleToFill"
          class="avatar"
        />
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 next"
        />
      </view>
      <view class="line" />

      <view class="content">
        <text class="left">性别</text>
        <text class="gender" @tap="onGenderChange"> 女 </text>
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 next"
        />
      </view>
      <view class="line" />

      <view class="content">
        <text class="left">昵称</text>
        <!-- <text class="right"> -->
        <input type="text" placeholder="请输入昵称(10字以内)" maxlength="10" />
        <!-- <text class="txt">{{ userInfo.nickname }}</text> -->
        <!-- </text> -->
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 next"
        />
      </view>
      <view class="line"></view>

      <view class="content">
        <text class="left">电话</text>
        <text class="right">
          15961520129
          <!-- <text class="txt">{{ userInfo.phone }}</text> -->
        </text>
      </view>
      <view class="line" />

      <view class="content">
        <text class="left">身份</text>
        <text class="right">
          普通用户
          <!-- <text class="txt">{{ userInfo.nickname }}</text> -->
        </text>
      </view>
      <view class="line" />

      <view class="content">
        <text class="left">口号</text>
        <input type="text" placeholder="请输入口号(15字以内)" maxlength="15" />
        <!-- <text class="txt">{{ userInfo.slogan }}</text> -->
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 next"
        />
      </view>
      <view class="line" />
    </view>

    <view class="position">
      <view class="button-container">
        <button class="save-button">保存</button>
        <!-- <button class="logout-button" @tap="handleQuitClick">退出登录</button> -->
        <button class="logout-button">退出登录</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import Back from "@/components/back.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
// import { logout } from "@/service/user";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

onLoad(() => {
  // Object.assign 合并数据 从全局状态合并到当前表单中
  Object.assign(myUserInfo, userInfo.value);
});

// 用户信息
const myUserInfo = reactive({
  pkId: 0,
  avatar: "",
  // gender: 0, // ??
  nickname: "mxy",
  phone: "15961520129",
  slogan: "健康",
});

// 打开修改头像
const onAvatarChange = () => {};

// 打开修改性别
const onGenderChange = () => {};

// 打开修改昵称
const onNickNameChange = () => {};

// 打开修改电话
const onPhoneChange = () => {};

// 打开修改口号
const onSloganChange = () => {};

// const handleQuitClick = () => {
//   uni.showModal({
//     title: "是否退出",
//     success: async (res) => {
//       if (res.confirm) {
//         const res = await logout();
//         if (res.code === 0) {
//           // 清除用户信息
//           userStore.clearUserInfo();
//           // 清除token
//           uni.removeStorageSync("token");
//           uni.showToast({
//             title: "操作成功",
//           });
//           uni.reLaunch({
//             url: "/pages/login/login",
//           });
//         }
//       }
//     },
//   });
// };
</script>

<style lang="scss" scoped>
.userInfoPage {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  margin-top: 45rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 40rpx;
  .avatar {
    border-radius: 50%; /* 设置为圆形 */
    width: 100rpx; /* 设置宽度 */
    height: 100rpx; /* 设置高度 */
    right: 100rpx;
    position: absolute; /* 使用绝对定位 */
  }
  .left {
    font-size: 36rpx;
    color: #000;
    font-weight: bold;
  }
  .right {
    font-size: 36rpx;
    color: gray;
    // right: 100rpx; /* 距离右边80rpx */
    // margin-right: 50rpx;
  }
  .gender {
    font-size: 36rpx;
    color: gray;
    right: 100rpx;
    position: absolute;
  }
  input {
    text-align: right;
    // direction: ltr;
    right: 100rpx;
    position: absolute;
  }
  // .next {
  // position: absolute; /* 使用绝对定位 */
  // display: inline-block;
  // right: 30rpx;
  // padding-left: 30rpx;
  // }
  // &:has(.next) {
  //   .right {
  //     right: 60rpx; // 当存在 next 类的元素时，设置左边文字距离箭头 30rpx
  //   }
  // }
}
.line {
  border-bottom: 1px solid #e0e0e0;
  margin-top: 40rpx;
  margin-right: 25rpx;
}

.position {
  background-color: #f5f5f5;
  flex-grow: 1;
}
// 按钮容器样式，确保按钮在同一行
.button-container {
  display: flex;
  justify-content: space-between; // 按钮之间的间隔均匀分布
  align-items: center; // 垂直居中对齐
  margin-left: 30rpx;
  margin-right: 30rpx;
  margin-top: 80rpx;
}

.save-button {
  background-color: #00a651;
  color: white;
  display: flex;
  justify-content: center; /* 水平方向居中文字 */
  align-items: center; /* 垂直方向居中文字 */
  border: none;
  border-radius: 10rpx;
  font-size: 35rpx;
  flex: 1; // 按钮占据可用空间的1份
  margin-right: 80rpx; // 与退出登录按钮的间距
  height: 80rpx;
}

.logout-button {
  background-color: #e84539;
  color: white;
  display: flex;
  justify-content: center; /* 水平方向居中文字 */
  align-items: center; /* 垂直方向居中文字 */
  border: none;
  border-radius: 10rpx;
  font-size: 35rpx;
  flex: 1; // 按钮占据可用空间的1份
  height: 80rpx;
}
</style>
