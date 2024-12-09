import { http } from "@/utils/http";

export const getSubjectList = (data) => {
  return http({
    method: "get",
    url: "/index/itemList",
    data,
  });
};
