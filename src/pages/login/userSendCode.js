import { reactive, ref } from "vue";
import { sendCode } from "@/service/user";
import { isPhoneAvailable } from "@/utils/validate";

function userSendCodeFunction() {
  // 倒计时
  const count = ref(60);
  // 是否显示倒计时
  const timer = ref(false);
  const phoneForm = reactive({
    phone: "",
    code: "",
  });
  const sendPhoneCode = async () => {
    // 手机号校验正则
    if (phoneForm.phone && isPhoneAvailable(phoneForm.phone)) {
      const res = await sendCode(phoneForm.phone);
      if (res.code === 0) {
        timer.value = true;
        const interval = setInterval(() => {
          count.value--;
          if (count.value <= 0) {
            timer.value = false;
            timer.value = 60;
            clearInterval(interval);
          }
        }, 1000);
        uni.showToast({
          title: "验证码发送成功",
          icon: "none",
        });
      } else {
        uni.showToast({
          title: "验证码发送失败",
          icon: "none",
        });
        return;
      }
    } else {
      uni.showToast({
        title: "请输入正确的手机号码",
        icon: "none",
      });
    }
  };

  return {
    count,
    timer,
    phoneForm,
    sendPhoneCode,
  };
}
export default userSendCodeFunction;
