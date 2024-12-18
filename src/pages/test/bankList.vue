<template>
  <Back>
    <slot>江苏中医在线答题</slot>
  </Back>
  <div class="exam-container px-5">
    <div class="header px-5">
      <div class="exam-info">
        <div class="title">{{ title }}</div>
        <div class="timer-submit">
          <div class="timer">
            <div>剩余时间</div>
            <div>{{ formatTime(remainingTime) }}</div>
          </div>
        </div>
      </div>
      <div class="exam-note">
        共{{ questions.length }}道题，共{{ formatTime(totalTime) }}
      </div>
      <div class="exam-warning">注：考核过程中请不要关闭考试页面！</div>
    </div>

    <div class="questions">
      <div
        v-for="(question, index) in questions"
        :key="question.pkId"
        class="question-item"
      >
        <div class="question-title">
          {{ index + 1 }}. {{ question.optionType === 1 ? "多选题：" : ""
          }}{{ question.question }}
        </div>

        <!-- 选择题选项 -->
        <div v-if="question.optionType === 0 || question.optionType === 1">
          <div
            v-for="option in question.options"
            :key="option.pkId"
            class="option-item"
            :class="{ selected: isOptionSelected(question, option) }"
            @click="selectAnswer(question, option)"
          >
            <text>{{ option.option }} {{ option.content }}</text>
          </div>
        </div>

        <!-- 填空题 -->
        <div v-else-if="question.optionType === 2">
          <input
            type="text"
            v-model="answers[question.pkId]"
            placeholder="请输入答案"
            class="fill-input"
          />
        </div>
      </div>
    </div>

    <div class="submit-btn" @click="submitExam">交卷</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Back from "@/components/back.vue";
import { getBankList, submitExamAnswers } from "@/service/exam";

const props = defineProps({
  pkId: Number,
  timeLimit: Number,
  title: String,
  paperId: Number,
});
// 选项排序函数
const sortedOptions = (options) => {
  return [...options].sort((a, b) => {
    // 假设选项的值为 A、B、C、D
    return a.option.localeCompare(b.option);
  });
};
const questions = ref([]);
const loading = ref(true);
const answers = ref({});
const multiAnswers = ref({});

// 添加总时间和倒计时时间的计算
const totalTime = ref(props.timeLimit * 60); // 将分钟转换为秒
const remainingTime = ref(props.timeLimit * 60);

// 获取题目列表
const getQuestions = async () => {
  try {
    const params = {
      page: 1,
      limit: 100,
      order: "",
      asc: true,
      quizExamId: props.pkId,
      paperId: props.paperId,
    };

    const res = await getBankList(params);

    if (res.code === 0 && res.data && res.data.list) {
      // 确保 res.data.list 存在再进行 map 操作
      questions.value = res.data.list
        .map((question) => {
          if (!question) return null; // 跳过空值

          return {
            pkId: question.pkId,
            optionType: question.optionType,
            question: question.question,
            options: Array.isArray(question.options)
              ? question.options.map((opt) => ({
                  pkId: opt.pkId,
                  bankId: opt.bankId,
                  option: opt.option,
                  content: opt.content,
                }))
              : [],
          };
        })
        .filter((q) => q !== null); // 过滤掉空值
    } else {
      throw new Error("获取题目数据格式错误");
    }
  } catch (error) {
    console.error("获取题目失败:", error);
    uni.showToast({
      title: "获取题目失败",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// 格式化时间
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// 获取题目类型
const getQuestionType = (type) => {
  switch (type) {
    case 0:
      return "(单选题)";
    case 1:
      return "(多选题)";
    case 2:
      return "(填空题)";
    default:
      return "";
  }
};

// 选择答案
const selectAnswer = (question, option) => {
  if (question.optionType === 0) {
    // 单选题
    answers.value[question.pkId] = option.option;
  } else if (question.optionType === 1) {
    // 多选题
    if (!multiAnswers.value[question.pkId]) {
      multiAnswers.value[question.pkId] = [];
    }

    const index = multiAnswers.value[question.pkId].indexOf(option.option);
    if (index === -1) {
      // 如果选项不存在，添加
      multiAnswers.value[question.pkId].push(option.option);
    } else {
      // 如果选项已存在，移除
      multiAnswers.value[question.pkId].splice(index, 1);
    }
  }
};

// 检查选项是否被选中
const isOptionSelected = (question, option) => {
  if (question.optionType === 0) {
    // 单选题
    return answers.value[question.pkId] === option.option;
  } else if (question.optionType === 1) {
    // 多选题
    return multiAnswers.value[question.pkId]?.includes(option.option);
  }
  return false;
};

// 检查未答题目
const checkUnansweredQuestions = () => {
  const unansweredQuestions = questions.value.filter((question) => {
    if (question.optionType === 0) {
      // 单选题
      return !answers.value[question.pkId];
    } else if (question.optionType === 1) {
      // 多选题
      return (
        !multiAnswers.value[question.pkId] ||
        multiAnswers.value[question.pkId].length === 0
      );
    } else if (question.optionType === 2) {
      // 填空题
      return (
        !answers.value[question.pkId] ||
        answers.value[question.pkId].trim() === ""
      );
    }
    return false;
  });

  return unansweredQuestions.map((q, index) => {
    const questionIndex =
      questions.value.findIndex((item) => item.pkId === q.pkId) + 1;
    return questionIndex;
  });
};

// 提交考试
const submitExam = async () => {
  const unansweredQuestions = checkUnansweredQuestions();

  if (unansweredQuestions.length > 0) {
    // 显示确认对话框
    uni.showModal({
      title: "提示",
      content: `第 ${unansweredQuestions.join(", ")} 题未作答，是否确认提交？`,
      success: async (res) => {
        if (res.confirm) {
          // 用户点击确定，继续提交
          await submitAnswers();
        }
        // 用户点击取消，返回继续答题
      },
    });
  } else {
    // 所有题目都已作答，直接提交
    await submitAnswers();
  }
};

// 实际提交答案的函数
const submitAnswers = async () => {
  const submitData = {
    examId: props.pkId,
    paperId: props.paperId,
    answers: questions.value.map((question) => {
      let answer = "";

      if (question.optionType === 0) {
        // 单选题
        answer = answers.value[question.pkId] || "";
      } else if (question.optionType === 1) {
        // 多选题
        answer = (multiAnswers.value[question.pkId] || []).sort().join("");
      } else if (question.optionType === 2) {
        // 填空题
        answer = answers.value[question.pkId] || "";
      }

      return {
        pkId: question.pkId,
        optionType: question.optionType,
        answer: answer,
      };
    }),
  };

  try {
    const res = await submitExamAnswers(submitData);
    if (res.code === 0) {
      uni.showToast({
        title: "提交成功",
        icon: "success",
      });

      const scoreData = {
        data: {
          totalScore: res.data.totalScore,
          score: res.data.score,
          correctCount: res.data.correctCount,
          totalCount: res.data.totalCount,
          passScore: res.data.passScore,
          isPassed: res.data.isPassed,
        },
      };

      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/test/score?scoreData=${encodeURIComponent(
            JSON.stringify(scoreData)
          )}`,
        });
      }, 1500);
    }
  } catch (error) {
    console.error("提交答案失败:", error);
    uni.showToast({
      title: "提交失败",
      icon: "error",
    });
  }
};

// 添加倒计时逻辑
onMounted(() => {
  if (props.pkId && props.paperId) {
    getQuestions();
  } else {
    console.error("缺少必要的参数: pkId 或 paperId");
    uni.showToast({
      title: "参数错误",
      icon: "error",
    });
  }
  // 开始倒计时
  const timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      clearInterval(timer);
      // 时间到自动交卷
      submitExam();
    }
  }, 1000);
});
</script>

<style scoped>
.exam-container {
  background-color: #fff;
  min-height: 100vh;
}

.header {
  margin-bottom: 20px;
  background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.9)
    ),
    url("https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/action_bg.png")
      no-repeat center;
  background-size: cover;
  border-radius: 10px;
}

.exam-info {
  margin-top: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
}

.timer-submit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.timer {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.submit-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00a862;
  color: white;
  padding: 12px 0;
  font-size: 16px;
  text-align: center;
  z-index: 100;
}

.questions {
  padding-bottom: 60px;
}

.exam-note {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.exam-warning {
  color: #ff0000;
  font-size: 14px;
}

.question-item {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.question-title {
  font-size: 16px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.question-type {
  color: #666;
  font-size: 14px;
  margin-left: 10px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  background-color: #fff;
}

.option.selected {
  background-color: #00a862;
  color: white;
}

.option.selected .option-label {
  background-color: #00a862;
  color: white;
  border: 1px solid white;
}

.option-label {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 10px;
  font-size: 16px;
}

.option-content {
  flex: 1;
  font-size: 14px;
}

.fill-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 25px;
  font-size: 14px;
  background-color: #fff;
}

.fill-input:focus {
  border-color: #32b880;
  outline: none;
}

.option-item {
  padding: 24rpx 32rpx;
  margin: 20rpx 0;
  border-radius: 50rpx;
  background: #fff;
  color: #333;
  font-size: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.option-item.selected {
  background-color: #00a651;
  color: #fff;
  border-color: #00a651;
}

.fill-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #eee;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  margin: 20rpx 0;
}

/* 添加点击效果 */
.option-item:active {
  opacity: 0.8;
}
</style>
