import { http } from "@/utils/http";

export const getPublicSubjectList = (data) => {
  return http({
    method: "get",
    url: "/index/publicItemList",
    data,
  });
};

export const getSubjectBook = (id) => {
  return http({
    method: "get",
    url: `/index/bookList?subjectId=${id}`,
  });
};

export const getSubjectPodcast = (id) => {
  return http({
    method: "get",
    url: `/index/podcastList?subjectId=${id}`,
  });
};

export const getSubjectVideo = (id) => {
  return http({
    method: "post",
    url: `/item/course/` + id,
  });
};

export const getSubjectVideoCollection = (id) => {
  return http({
    method: "get",
    url: `/index/videosList?subjectId=${id}`,
  });
};

export const getSubjectVideoDetail = (id, data) => {
  return http({
    method: "post",
    url: `/item/videos/` + id,
    data,
  });
};
