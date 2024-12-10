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
