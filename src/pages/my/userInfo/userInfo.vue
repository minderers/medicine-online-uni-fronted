<template>
  <Back><slot>个人资料</slot></Back>

  <view class="userInfoPage">
    <view class="user-info ml-30rpx">
      <view class="content">
        <text class="left">头像</text>
        <text class="right"></text>
        <image
          :src="myUserInfo.avatar"
          mode="aspectFill"
          class="avatar"
          @tap="onAvatarChange"
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
        <view class="radio-group">
          <radio-group @change="selectSex">
            <label class="radio-label">
              <radio value="0" :checked="myUserInfo.sex === 0" />男
            </label>
            <label class="radio-label">
              <radio value="1" :checked="myUserInfo.sex === 1" />女
            </label>
          </radio-group>
        </view>
      </view>
      <view class="line" />

      <view class="content">
        <text class="left">昵称</text>
        <input
          v-if="userInfo?.nickname"
          type="text"
          placeholder="请输入昵称(10字以内)"
          maxlength="10"
          v-model="userInfo.nickname"
          @input="onNickNameChange"
        />
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 next"
        />
      </view>
      <view class="line"></view>

      <view class="content">
        <text class="left">电话</text>
        <text class="right" v-if="userInfo?.phone">
          {{ userInfo.phone }}
          <!-- <text class="txt">{{ userInfo.phone }}</text> -->
        </text>
      </view>
      <view class="line" />

      <view class="content">
        <text class="left">身份</text>
        <text class="right">
          学员
          <!-- <text class="txt">{{ userInfo.nickname }}</text> -->
        </text>
      </view>
      <view class="line" />

      <view class="content">
        <text class="left">口号</text>
        <input
          v-if="userInfo?.slogan"
          type="text"
          placeholder="请输入口号(15字以内)"
          maxlength="15"
          v-model="userInfo.slogan"
          @input="onSloganChange"
        />
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
        <button class="save-button" @tap="handleSubmit">保存</button>
        <button
          class="logout-button"
          v-if="userStore.userInfo"
          @tap="handleQuitClick"
        >
          退出登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import Back from "@/components/back.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { logout, updateUserInfo } from "@/service/user";

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
  sex: 0,
  nickname: "",
  phone: "",
  slogan: "",
});

// 修改头像
const onAvatarChange = () => {
  uni.chooseMedia({
    // 文件个数
    count: 1,
    // 文件类型
    mediaType: ["image"],
    success: (res) => {
      // 本地路径
      const { tempFilePath } = res.tempFiles[0];
      // 上传
      uploadFile(tempFilePath);
    },
  });
};
// ⽂件上传-兼容⼩程序端、H5端、App端
const uploadFile = (file) => {
  // ⽂件上传
  uni.uploadFile({
    url: "/common/upload/img",
    name: "file", // 后端数据字段名
    filePath: file, // 新头像
    success: (res) => {
      // 解析响应数据
      const response = JSON.parse(res.data);
      // 判断状态码是否上传成功
      if (response.code === 0) {
        // 头像URL
        const url = response.data;
        // 当前⻚⾯更新头像
        myUserInfo.avatar = url;
        // 更新 Store 头像
        userStore.userInfo.avatar = url;
        uni.showToast({ icon: "success", title: "更新成功" });
      } else {
        uni.showToast({ icon: "error", title: response.msg || "上传失败" });
      }
    },
    fail: (err) => {
      uni.showToast({ icon: "error", title: "上传失败" });
      console.error("Upload failed:", err);
    },
  });
};

// 修改选择性别的方法
const selectSex = (e) => {
  const sex = parseInt(e.detail.value);
  myUserInfo.sex = sex;
  userStore.userInfo.sex = sex;
};

// 打开修改昵称
const onNickNameChange = (e) => {
  const inputValue = e.target.value.trim();
  myUserInfo.nickname = inputValue;
  userStore.userInfo.nickname = inputValue;
};

// 修改口号
const onSloganChange = (e) => {
  const inputValue = e.target.value.trim(); // 获取输入值并去除前后空格
  // if (inputValue.length > 10) {
  //   uni.showToast({
  //     title: "昵称长度不能超过15个字",
  //     icon: "none",
  //   });
  //   return;
  // }
  myUserInfo.slogan = inputValue;
  userStore.userInfo.slogan = inputValue;
};

// 提交表单
const handleSubmit = async () => {
  const res = await updateUserInfo(myUserInfo);
  if (res.code === 0) {
    uni.showToast({
      title: "修改成功",
    });
    userStore.setUserInfo(res.data);
    setTimeout(() => {
      uni.navigateBack({ delta: 1 });
    }, 1000);
  } else {
    uni.showToast({
      title: "修改失败",
      icon: "none",
    });
  }
};

// 退出登录
const handleQuitClick = () => {
  uni.showModal({
    title: "是否退出",
    success: async (res) => {
      if (res.confirm) {
        const res = await logout();
        if (res.code === 0) {
          // 清除用户信息
          userStore.clearUserInfo();
          // 清除token
          uni.removeStorageSync("token");
          uni.showToast({
            title: "操作成功",
          });
          uni.reLaunch({
            url: "/pages/login/login",
          });
        }
      }
    },
  });
};
</script>

<style lang="scss" scoped>
.userInfoPage {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 200rpx);
}
.content {
  margin-top: 40rpx;
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
  .sex {
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
.radio-group {
  display: flex;
  align-items: center;
}

.radio-label {
  margin-left: 20rpx;
  font-size: 32rpx;
  color: #333;
}
</style>
