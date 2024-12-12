import { http } from "@/utils/http";

/**
 * 获取分页资讯列表
 * @returns
 */
export const getNewsList = (data) => {
  return http({
    method: "POST",
    url: "/newsList/page",
    data,
  });
};

/**
 * 获取资讯详情
 * @returns
 */

export const getNewsDetail = (id) => {
  return http({
    method: "GET",
    url: `/newsListDetail/${id}`,
  });
};
