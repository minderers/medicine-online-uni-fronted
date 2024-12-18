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
    const apiUrl = "/professor/insert";
    const token = uni.getStorageSync("token");

    // 如果没有图片文件，使用普通请求
    if (!imgFiles || imgFiles.length === 0) {
      return http({
        method: "POST",
        url: apiUrl,
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
        data: {
          professorId: String(professorId),
          content: content,
        },
      })
        .then((response) => {
          if (response.code === 0) {
            uni.showToast({
              title: "提交成功",
              icon: "success",
            });
            setTimeout(() => {
              const pages = getCurrentPages();
              const prevPage = pages[pages.length - 2];
              if (prevPage && prevPage.$vm.getProfessorInfo) {
                prevPage.$vm.getProfessorInfo();
              }
              uni.navigateBack();
            }, 1500);
          }
          resolve(response);
        })
        .catch(reject);
    }

    // 处理图片上传
    let uploadTasks = [];
    imgFiles.forEach((filePath, index) => {
      const uploadTask = uni.uploadFile({
        url: import.meta.env.VITE_API_URL + apiUrl,
        filePath: filePath,
        name: "imgFile",
        header: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        formData: {
          professorId: String(professorId),
          content: content,
          fileIndex: String(index),
        },
        success: (uploadRes) => {
          try {
            const response = JSON.parse(uploadRes.data);
            if (response.code === 0) {
              uni.showToast({
                title: "提交成功",
                icon: "success",
              });
              setTimeout(() => {
                const pages = getCurrentPages();
                const prevPage = pages[pages.length - 2];
                if (prevPage && prevPage.$vm.getProfessorInfo) {
                  prevPage.$vm.getProfessorInfo();
                }
                uni.navigateBack();
              }, 1500);
            }
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
  });
};

/**
 * 获取回复列表
 * @param id
 * @returns
 */
export const getReplyListById = (id) => {
  return http({
    method: "POST",
    url: "/professor/replyList/" + id,
  });
};

/**
 * 获取问题详情
 * @param id
 * @returns
 */
export const getTopicById = (id) => {
  return http({
    method: "POST",
    url: "/professor/topic/" + id,
  });
};

/**
 * 回复
 */
export const addReply = (topicId, content, imgFiles) => {
  return new Promise((resolve, reject) => {
    const apiUrl = "/professor/reply";

    // 如果没有图片文件，使用 uni.request 发送普通请求
    if (!imgFiles || imgFiles.length === 0) {
      uni.request({
        url: apiUrl,
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
        data: {
          topicId: String(topicId),
          content: content,
        },
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
        },
      });
      return;
    }

    // 处理图片上传
    let uploadTasks = [];
    imgFiles.forEach((filePath, index) => {
      const uploadTask = uni.uploadFile({
        url: apiUrl,
        filePath: filePath,
        name: "imgFile",
        formData: {
          topicId: String(topicId),
          content: content,
          fileIndex: String(index),
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
  });
};
