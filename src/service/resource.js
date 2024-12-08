import { http } from "@/utils/http";


export const getResourceCategory = (parentId) => {
  return http({
    method: "POST",
    url: `/resource/category?parentId=${parentId}`, // 后端接口地址
      });
};

export const getsPageCourseList = (data) => {
  return http({
    method: "post",
    url: "/index/courseList",
    data,
  });
};

export const getCourseDetail = (id) => {
  return http({
    method: "post",
    url: `/courseDetail/${id}`, // 修改URL以反映获取课程详情的意图
  });
};
