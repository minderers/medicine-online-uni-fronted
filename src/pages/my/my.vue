<template>
  <view class="page-container">
    <!-- 背景图部分 -->
    <view class="header">
      <image
        src="@/static/profile/bg.png"
        mode="aspectFill"
        class="bg-image"
      ></image>
    </view>

    <!-- 内容区域 -->
    <view class="content-wrapper">
      <!-- 用户信息部分 -->
      <view class="user-section">
        <image
          v-if="userInfo"
          :src="userInfo.avatar"
          mode="aspectFill"
          class="avatar-img"
          @click="gotoUserInfo"
        />
        <view class="user-info">
          <view class="name-container">
            <text class="name" v-if="userInfo?.nickname">{{
              userInfo.nickname
            }}</text>
            <text class="identity">(学员)</text>
            <button class="authentication" @click="gotoBindPhone">
              绑定手机
            </button>
          </view>
          <text class="slogan" v-if="userInfo?.slogan"
            >学习口号：{{ userInfo.slogan }}</text
          >
        </view>
        <text class="edit-profile" @click="gotoUserInfo">编辑个人资料</text>
      </view>

      <!-- 功能列表 -->
      <view class="action-list">
        <view
          class="action-item"
          v-for="(item, index) in actionItems"
          :key="index"
          @click="item.action"
        >
          <view class="action-content">
            <image :src="item.icon" mode="scaleToFill" class="action-icon" />
            <text class="action-text">{{ item.text }}</text>
            <text v-if="item.version" class="version">{{ item.version }}</text>
          </view>
          <image
            src="@/static/index/next.png"
            mode="scaleToFill"
            class="next-icon"
          />
        </view>
      </view>

      <!-- 版权信息 -->
      <view class="footer">
        <text class="copyright">版权所有</text>
        <text class="copyright">江苏凤凰科学技术出版社有限公司</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.header {
  height: 400rpx;
  width: 100%;
}

.bg-image {
  width: 100%;
  height: 100%;
}

.content-wrapper {
  flex: 1;
  margin-top: -25rpx;
  border-radius: 20rpx 20rpx 0 0;
  background-color: #fff;
  position: relative;
  z-index: 1;
  box-shadow: 0rpx -10rpx 20rpx rgba(255, 255, 255, 0.8);
}

.user-section {
  padding: 30rpx;
  position: relative;
}

.avatar-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-top: -60rpx;
  box-shadow: 0rpx 10rpx 20rpx rgba(0, 0, 0, 0.3);
}

.user-info {
  margin-top: 20rpx;
}

.name-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20rpx;
}

.name {
  font-size: 28rpx;
  font-weight: bold;
}

.identity {
  font-size: 24rpx;
  color: #666;
}

.authentication {
  font-size: 24rpx;
  background-color: #00a651;
  color: white;
  padding: 4rpx 20rpx;
  border-radius: 10rpx;
  margin: 0;
  line-height: 1.5;
}

.edit-profile {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
  font-size: 24rpx;
  color: #666;
}

.slogan {
  font-size: 24rpx;
  color: #666;
  margin-top: 20rpx;
}

.action-list {
  margin-top: 30rpx;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.action-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.action-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.action-text {
  font-size: 28rpx;
  color: #333;
}

.version {
  font-size: 24rpx;
  color: #999;
  margin-left: auto;
  margin-right: 20rpx;
}

.next-icon {
  width: 32rpx;
  height: 32rpx;
}

.footer {
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.copyright {
  font-size: 24rpx;
  color: #999;
  text-align: center;
}
</style>

<script setup>
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { ref } from "vue";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

// 可以在这里通过控制台打印等方式查看 userInfo 的值
onMounted(() => {
  console.log("当前 Pinia 中的 userInfo:", userInfo.value);
  // console.log("当前 Pinia 中的 userInfo:", userInfo.nickname);
  // console.log("当前 Pinia 中的 userInfo:", userInfo.value.nickname);
  // 或者调用获取用户信息的方法，等待获取后再查看（假设获取是异步的）
  userStore.getLoginUserInfo().then(() => {
    console.log("获取后 Pinia 中的 userInfo:", userInfo.value);
  });
});

// 控制弹窗显示的响应式变量
const showPopup = ref();
const toggleShowPopup = () => {
  showPopup.value.open();
};

const closeShowPopup = () => {
  showPopup.value.close();
};

const gotoUserInfo = () => {
  uni.navigateTo({
    url: `/pages/my/userInfo/userInfo`,
  });
};

const gotoBindPhone = () => {
  uni.navigateTo({
    url: `/pages/my/bindPhone`,
  });
};

const gotoMyCollect = () => {
  uni.navigateTo({
    url: `/pages/my/myCollect`,
  });
};

const gotoMyRecord = () => {
  uni.navigateTo({
    url: `/pages/my/myRecord`,
  });
};

const gotoManual = () => {
  uni.navigateTo({
    url: `/pages/my/manual?pkId=${encodeURIComponent(0)}`,
  });
};

const gotoAbout = () => {
  uni.navigateTo({
    url: `/pages/my/about?pkId=${encodeURIComponent(1)}`,
  });
};

// 定义功能列表数据
const actionItems = [
  {
    icon: "https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/profile/icon_wodeshoucang.png",
    text: "我的收藏",
    action: gotoMyCollect,
  },
  {
    icon: "https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/profile/icon_xuexilishi.png",
    text: "浏览记录",
    action: gotoMyRecord,
  },
  {
    icon: "https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/profile/icon_shiyongshouce.png",
    text: "使用手册",
    action: gotoManual,
  },
  {
    icon: "https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/profile/icon_about_us.png",
    text: "关于我们",
    action: gotoAbout,
  },
  {
    icon: "https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/profile/icon_about_us.png",
    text: "检查更新",
    version: "5.2.5",
    action: toggleShowPopup,
  },
];
</script>
