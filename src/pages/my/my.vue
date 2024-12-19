<template>
  <view>
    <image
      src="@/static/profile/bg.png"
      mode="aspectFill"
      class="left-0 top-0 w-full h-400rpx"
    ></image>
  </view>

  <view class="bg">
    <image
      v-if="userInfo"
      :src="userInfo.avatar"
      mode="aspectFill"
      class="avatar-img"
      @click="gotoUserInfo"
    />
    <text class="userInfo text-gray-400" @click="gotoUserInfo">
      编辑个人资料
    </text>
    <view class="container">
      <text class="name" v-if="userInfo?.nickname">
        {{ userInfo.nickname }}
      </text>
      <text class="identity text-gray-400">(普通用户)</text>
      <button class="authentication" @click="gotoBindPhone">绑定手机</button>
    </view>

    <view class="slogan text-gray-400" v-if="userInfo?.slogan">
      学习口号：{{ userInfo.slogan }}
    </view>

    <!-- 操作 -->
    <!-- <view class="action-info" v-if="userInfo"> -->
    <view class="action-info mt-30rpx">
      <view class="content" @click="gotoMyCollect">
        <image
          src="@/static/profile/icon_wodeshoucang.png"
          mode="scaleToFill"
          class="ml-30rpx h-5 w-5"
        />
        <text class="txt">我的收藏</text>
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 ml-460rpx"
        />
      </view>

      <view class="content" @click="gotoMyRecord">
        <image
          src="@/static/profile/icon_xuexilishi.png"
          mode="scaleToFill"
          class="ml-30rpx h-5 w-5"
        />
        <text class="txt">浏览记录</text>
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 ml-460rpx"
        />
      </view>

      <view class="content" @click="gotoManual">
        <image
          src="@/static/profile/icon_shiyongshouce.png"
          mode="scaleToFill"
          class="ml-30rpx h-5 w-5"
        />
        <text class="txt">使用手册</text>
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 ml-460rpx"
        />
      </view>

      <view class="content" @click="gotoAbout">
        <image
          src="@/static/profile/icon_about_us.png"
          mode="scaleToFill"
          class="ml-30rpx h-5 w-5"
        />
        <text class="txt">关于我们</text>
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 ml-460rpx"
        />
      </view>

      <view class="content" @tap="toggleShowPopup">
        <image
          src="@/static/profile/icon_about_us.png"
          mode="scaleToFill"
          class="ml-30rpx h-5 w-5"
        />
        <text class="txt">检查更新</text>
        <text class="version text-gray-400">5.2.5</text>
        <image
          src="@/static/index/next.png"
          mode="scaleToFill"
          class="h-5 w-5 ml-460rpx"
        />
        <!-- 弹窗条件渲染 -->
        <uni-popup ref="showPopup" type="center">
          <view class="popup-content">
            <text class="word">已经是最新版本喽~</text>
            <button class="true" @tap="closeShowPopup">确定</button>
          </view>
        </uni-popup>
      </view>
    </view>
    <view class="line"></view>

    <view class="mt-120rpx bq">
      <view class="copy-right">版权所有</view>
      <view class="copy-right">江苏凤凰科学技术出版社有限公司</view>
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { ref } from "vue";
import uniPopup from "@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue";

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
</script>

<style scoped>
.bg {
  /* top: 400rpx;
  right: 0;
  left: 0;
  position: absolute;
  background-color: pink; */
  position: relative;
  top: -25rpx;
  flex-grow: 1;
  border-top-left-radius: 20rpx; /* 设置左上角圆角半径为20px，可调整该值改变圆角程度 */
  border-top-right-radius: 20rpx; /* 设置右上角圆角半径为20px */
  /* box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2); 上边框模糊效果，水平偏移0px，垂直偏移 -5px（向上偏移），模糊半径10px，颜色为黑色半透明 */
  box-shadow: 0rpx -10rpx 20rpx #ffffff;
  background-color: #fff;
}
.avatar-img {
  /* left: 20rpx;
  top: 330rpx;
  position: absolute; */
  left: 20rpx;
  top: -70rpx;
  position: relative;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0rpx 10rpx 20rpx rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
}
.userInfo {
  font-size: 24rpx;
  right: 20rpx;
  top: 10rpx;
  position: absolute;
  /* top: -50rpx; */
  /* position: relative; */
}

.container {
  position: relative;
  top: -100rpx;
  display: flex;
  align-items: center;
  margin-top: 60rpx;
}
.name {
  font-size: 25rpx;
  margin-left: 30rpx;
  margin-right: 10px; /* 与身份标识之间的间距 */
}
.identity {
  font-size: 25rpx;
  margin-left: 30rpx;
  /* margin-right: 10px; 与认证按钮之间的间距 */
}
.authentication {
  font-size: 30rpx;
  background-color: #00a651;
  color: white;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  border-radius: 10rpx;
  margin-left: 25rpx;
  height: 45rpx;
  width: auto;
  line-height: 45rpx; /* 设置行高与按钮高度相同 */
  /* text-align: center; */
}

.slogan {
  position: relative;
  top: -100rpx;
  font-size: 25rpx;
  margin-left: 30rpx;
  margin-top: 20rpx;
}

.action-info {
  position: relative;
  top: -100rpx;
}
.content {
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 30rpx;
}
.ml-30rpx {
  margin-left: 30rpx;
}
.txt {
  margin-left: 30rpx;
}
.version {
  position: absolute;
  margin-left: 255rpx;
  font-size: 22rpx;
}

.popup-content {
  position: absolute;
  left: -350rpx;
  transform: translate(-50%, -50%);
  width: 550rpx;
  height: 300rpx;
  background-color: #ffffff;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中对齐内容 */
  justify-content: center; /* 水平居中对齐内容 */
  padding: 20rpx; /* 内边距 */
  border-radius: 20rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.word {
  font-size: 40rpx;
  color: #333;
  margin-bottom: 50rpx; /* 文本与按钮之间的间距 */
}

.true {
  width: 300rpx;
  height: 90rpx;
  background-color: #00a651;
  color: white;
  border: none;
  border-radius: 10rpx;
  font-size: 32rpx;
}

.next {
  width: 5rpx;
  height: 5rpx;
}
.copy-right {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9d9e9f;
  font-size: 25rpx;
  margin-top: 10rpx;
}
.line {
  position: relative;
  top: -100rpx;
  border-bottom: 0.5px solid #f5f5f5;
  margin-top: 30rpx;
}
.bq {
  position: relative;
  top: -100rpx;
}
</style>
