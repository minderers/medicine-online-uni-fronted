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
