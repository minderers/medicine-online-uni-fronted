import { http } from "@/utils/http";
export const queryByLevel = (data) => {
  return http({
    method: "GET",
    url: "/index/category",
    data,
  });
};
export const getCategoryListByParentId = (parentId) => {
  return http({
    method: "GET",
    url: `/index/categorylist?parentId=${parentId}`,
  });
};
