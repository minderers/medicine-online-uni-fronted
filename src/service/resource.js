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

export const getBookList = (categoryName) => {
  return http({
    method: "POST",
    url: `/resource/book/list?categoryName=${categoryName}`,
  });
};

export const getVideoList = (categoryId) => {
  return http({
    method: "POST",
    url: `/resource/video/list?categoryId=${categoryId}`,
  });
};

export const getPodcastList = (categoryId) => {
  return http({
    method: "POST",
    url: `/resource/podcast/list?categoryId=${categoryId}`,
  });
};
