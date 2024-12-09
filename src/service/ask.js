import { http } from "@/utils/http";
export const getCategoryList = () => {
  return http({
    method: "POST",
    url: "/professor/category",
  });
};
