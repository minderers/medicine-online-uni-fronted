import { http } from "@/utils/http";

export const getResourceCategory = (parentId) => {
  return http({
    method: "POST",
    url: `/resource/category?parentId=${parentId}`, // 后端接口地址
  });
};
