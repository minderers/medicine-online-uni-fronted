import { http } from "@/utils/http";

// 获取专家目录
export const getCategoryList = () => {
  return http({
    method: "POST",
    url: "/professor/category",
  });
};

// 获取专家列表
export const getProfessorList = (data) => {
  return http({
    method: "POST",
    url: "/professor/list",
    data,
  });
};

/**
 * 根据名称获取专家列表
 * @param {string} name - 专家姓名
 * @returns {Promise<Object>} - 包含专家列表的响应对象
 */
export const getProfessorListByName = (name) => {
  return http({
    method: "POST",
    url: `/professor/search?name=${name}`,
  });
};

/**
 * 获取专家详情
 * @param id
 * @returns
 */
export const getProfessorById = (id) => {
  return http({
    method: "POST",
    url: "/professor/detail/" + id,
  });
};

/**
 * 获取专家问题列表
 * @param id
 * @returns
 */
export const getTopicListById = (id) => {
  return http({
    method: "POST",
    url: "/professor/topicList/" + id,
  });
};

// 向专家提问
export const addTopic = (professorId, content, imgFiles) => {
  return new Promise((resolve, reject) => {
    const apiUrl = "/professor/insert"; // 不需要完整 URL，由拦截器处理
    const formData = {
      professorId: professorId,
      content: content,
    };

    let uploadTasks = [];

    imgFiles.forEach((filePath, index) => {
      const uploadTask = uni.uploadFile({
        url: apiUrl,
        filePath: filePath,
        name: "imgFile",
        formData: {
          ...formData,
          fileIndex: index.toString(), // 添加文件索引以便后端识别
        },
        success: (uploadRes) => {
          try {
            const response = JSON.parse(uploadRes.data);
            resolve(response);
          } catch (e) {
            reject(new Error("解析响应失败"));
          }
        },
        fail: (err) => {
          reject(err);
        },
      });

      uploadTasks.push(uploadTask);
    });

    if (uploadTasks.length === 0) {
      // 如果没有文件，则直接发送请求
      http({
        method: "POST",
        url: apiUrl,
        data: formData,
      })
        .then(resolve)
        .catch(reject);
    }
  });
};
