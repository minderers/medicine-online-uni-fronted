import { http } from "@/utils/http";

export const getStarList = (data) => {
  return http({
    method: "POST",
    url: "/star/v2/list",
    data,
  });
};

// 添加收藏
export const addCollection = (contentId, type) => {
  return http({
    method: "POST",
    url: `/star/v2/add`,
    data: {
      contentId: contentId,
      type: type,
    },
  });
};

// 删除收藏
export const deleteCollection = (contentId, type) => {
  return http({
    method: "POST",
    url: `/star/v2/delete`,
    data: {
      contentId: contentId,
      type: type,
    },
  });
};
