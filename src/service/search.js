import { http } from "@/utils/http";
export const getSearchContent = (data) => {
  return http({
    method: "GET",
    url: "/index/search",
    data: data,
  });
};
