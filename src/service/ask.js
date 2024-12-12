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
