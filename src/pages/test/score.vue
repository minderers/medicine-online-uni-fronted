<template>
  <div class="score-container">
    <div class="header">
      <Back>
        <slot>考试成绩</slot>
      </Back>
    </div>

    <div class="score-card">
      <div class="exam-title">考试成绩</div>

      <div class="score-circle">
        <div class="score-number">{{ score }}</div>
        <div class="score-label">得分</div>
      </div>

      <div class="score-details">
        <div class="detail-item">
          <div class="label">总分</div>
          <div class="value">{{ totalScore }}分</div>
        </div>
        <div class="detail-item">
          <div class="label">总题数</div>
          <div class="value">{{ totalQuestions }}题</div>
        </div>
        <div class="detail-item">
          <div class="label">正确题数</div>
          <div class="value">{{ correctCount }}题</div>
        </div>
        <div class="detail-item">
          <div class="label">正确率</div>
          <div class="value">{{ correctRate }}%</div>
        </div>
      </div>

      <div class="action-buttons">
        <div class="btn primary" @click="goBack">返回首页</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Back from "@/components/back.vue";

// 定义 props
const props = defineProps({
  scoreData: {
    type: String,
    default: "",
  },
});

const score = ref(0);
const totalScore = ref(0);
const totalQuestions = ref(0);
const correctCount = ref(0);
const passScore = ref(0);
const isPassed = ref(false);
const correctRate = ref(0);

// 监听 scoreData 的变化
watch(
  () => props.scoreData,
  (newVal) => {
    if (newVal) {
      try {
        const scoreDataObj = JSON.parse(decodeURIComponent(newVal));
        const data = scoreDataObj.data;

        // 设置各项数据
        score.value = data.score;
        totalScore.value = data.totalScore;
        totalQuestions.value = data.totalCount;
        correctCount.value = data.correctCount;
        passScore.value = data.passScore;
        isPassed.value = data.isPassed;

        // 计算正确率
        if (data.totalCount > 0) {
          correctRate.value = Math.round(
            (data.correctCount / data.totalCount) * 100
          );
        }
      } catch (error) {
        console.error("解析成绩数据失败:", error);
      }
    }
  },
  { immediate: true }
);

// 返回首页
const goBack = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};
</script>

<style scoped>
.score-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.score-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.exam-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.score-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a862, #32b880);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  color: white;
}

.score-number {
  font-size: 48px;
  font-weight: bold;
  line-height: 1;
}

.score-label {
  font-size: 16px;
  margin-top: 8px;
}

.score-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.detail-item {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.detail-item .label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.detail-item .value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.btn {
  flex: 1;
  padding: 12px 0;
  text-align: center;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
}

.btn.primary {
  background-color: #00a862;
  color: white;
}

.btn.secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}
</style>
