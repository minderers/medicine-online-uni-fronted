import { http } from "@/utils/http";
//获取考核列表
export const getQuizList = (data) => {
  return http({
    method: "post",
    url: "/quiz/list",
    data,
  });
};

export const getExamList = (id) => {
  return http({
    method: "post",
    url: `/quiz/exam/${id}`,
  });
};

export const getBankList = (data) => {
  return http({
    method: "post",
    url: "/quiz/questionList",
    data,
  });
};
