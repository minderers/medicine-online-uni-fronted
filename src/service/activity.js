import { http } from "@/utils/http";

export const getVoteActivityList = () => {
  return http({
    method: "POST",
    url: `/vote/voteList`,
  });
};

export const getVoteInfoList = (activityId) => {
  return http({
    method: "POST",
    url: `/vote/voteInfoList?activityId=${activityId}`,
  });
};

export const checkIsVote = (activityId) => {
  return http({
    method: "POST",
    url: `/vote/isVote?activityId=${activityId}`,
  });
};

export const addVote = (activityId, infoId) => {
  return http({
    method: "POST",
    url: `/vote/vote`,
    data: {
      activityId,
      infoId,
    }, // 使用 data 传递请求体
  });
};
