import { http } from "@/utils/http";

export const myWxLogin = (code, encryptedData, iv) => {
  return http({
    method: "POST",
    url: "/auth/login",
    data: {
      code,
      encryptedData,
      iv,
    },
  });
};

// 发送短信验证码
export const sendCode = (phone) => {
  return http({
    method: "POST",
    url: "/common/sendCode?phone=" + phone,
  });
};

// ⼿机号登录
export const phoneLogin = (phone, code) => {
  return http({
    method: "POST",
    url: `/auth/loginByPhone?phone=${phone}&code=${code}`,
  });
};

// 更换⽤户⼿机号
export const updateUserPhone = (phone, code) => {
  return http({
    method: "POST",
    url: `/auth/bindPhone?phone=${phone}&code=${code}`,
  });
};

// 退出登录
export const logout = () => {
  return http({
    method: "POST",
    url: "/user/logout",
  });
};

// 查询用户信息
export const getUserInfo = () => {
  return http({
    method: "GET",
    url: `/user/getUserInfo`,
  });
};

// 更新用户信息
export const updateUserInfo = (data) => {
  return http({
    method: "POST",
    url: "/user/update",
    data,
  });
};

// 获取系统信息
export const getSystem = (type) => {
  return http({
    method: "POST",
    url: `/common/navigation/${type}`,
  });
};
