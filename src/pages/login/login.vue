<template>
  <div class="bg">
    <div class="button">
      <div class="flex align-center justify-center">
        <image
          src="https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/zhongyi.png"
          class="logo"
        />
      </div>
      <button @click="wxLogin">
        <text class="icon icon-weixin">确定授权</text>
      </button>
      <button>取消授权</button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../../stores/user";
import { myWxLogin } from "../../service/user";

const userStore = useUserStore();
// 对应返回来源⻚⾯或者⾸⻚
const navigateToUrl = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.switchTab({
      url: "/pages/index/index",
    });
  }
};

const wxLogin = () => {
  // 1.获取⽤户信息
  uni.getUserProfile({
    desc: "获取你的昵称、头像、地区及性别",
    success: (res) => {
      // 2.微信登录
      uni.login({
        provider: "weixin",
        success: async (loginRes) => {
          // 3.调⽤后台接⼝登录
          const wxLoginRes = await myWxLogin(
            loginRes.code,
            res.encryptedData,
            res.iv
          );
          if (wxLoginRes.code === 0) {
            uni.showToast({
              title: "登录成功",
              icon: "success",
            });
            // 4.保存token以及回退⻚⾯
            uni.setStorageSync("token", wxLoginRes.data.accessToken);
            uni.switchTab({
              url: "/pages/index/index",
            });
          } else {
            uni.showToast({
              title: wxLoginRes.msg,
              icon: "none",
            });
            return;
          }
        },
      });
    },
    fail: function (err) {
      uni.showToast({
        title: "获取⽤户信息失败",
        icon: "none",
      });
    },
  });
};
</script>

<style lang="scss" scoped>
.bg {
  background-image: url("https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/action_bg.png");
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button {
  button {
    width: 300px;
    height: 50px;
    border-radius: 5px;
    border: none;
    margin: 10px 5px;
  }
  button:nth-child(2) {
    background: #1aad19;
    color: white;
  }
}
.logo {
  width: 250px;
  height: 250px;
  margin-bottom: 20px;
}
</style>
