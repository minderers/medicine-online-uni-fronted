import { http } from "@/utils/http";

export const getsPageCourseList = (data) => {
  return http({
    method: "post",
    url: "/index/courseList",
    data,
  });
};
