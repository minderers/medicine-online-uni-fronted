import { http } from "@/utils/http";

export const myWxLogin = (code, encryptedData, iv) => {
  return http({
    method: "POST",
    url: "/auth/login",
    data: {
      code,
      encryptedData,
      iv,
    },
  });
};
