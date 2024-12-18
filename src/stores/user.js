import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserInfo } from "@/service/user";

// 定义 Store
export const useUserStore = defineStore(
  "user",
  () => {
    // 登录用户信息
    const userInfo = ref(null);

    // 保存登录用户信息
    const setUserInfo = (val) => {
      userInfo.value = val;
    };

    // 清除登录用户信息
    const clearUserInfo = () => {
      userInfo.value = undefined;
    };

    // 获取用户信息
    const getLoginUserInfo = async () => {
      const res = await getUserInfo();
      if (res.code === 0) {
        setUserInfo(res.data);
      }
    };

    // 记得 return
    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      getLoginUserInfo,
    };
  },
  {
    unistorage: true, // 开启后对 state 数据读写都将持久化
  }
);
