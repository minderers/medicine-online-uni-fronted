import { http } from "@/utils/http";
import { ref } from "vue";

// 提交反馈
export const submitFeedback = (data, imgUrls) => {
  return http({
    method: "POST",
    url: "/user/feedback",
    data: {
      ...data,
      img: imgUrls.join(","),
    },
  });
};

// 上传图片
export const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: "/common/upload/img", // 假设这是你的图片上传接口地址
      filePath: filePath,
      name: "file",
      formData: {},
      success: (uploadRes) => {
        try {
          const response = JSON.parse(uploadRes.data);
          if (response.code === 0) {
            resolve(response.data); // 返回 OSS 链接
          } else {
            reject(new Error("图片上传失败"));
          }
        } catch (e) {
          reject(new Error("解析响应失败"));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
