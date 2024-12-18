<template>
  <div>
    <Back>
      <slot>试卷列表</slot>
    </Back>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="examPaper" class="exam-card m-2">
      <div class="item py-5 px-4">
        <div class="left">{{ examPaper.title || examPaper.paperTitle }}</div>
        <div class="right text-white" @click="startExam">立即答题</div>
      </div>
    </div>
    <div v-else class="no-exam m-2 py-5 px-4">暂无可用试卷</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Back from "../../components/back.vue";
import { getExamList } from "@/service/exam";

const props = defineProps({
  pkId: Number,
});

const loading = ref(true);
const examPaper = ref(null);

// 获取试卷列表并随机选择一套
const getExam = async () => {
  try {
    const res = await getExamList(props.pkId);
    console.log("试卷数据:", res); // 调试用

    // 确保我们能获取到正确的数据结构
    if (res.code === 0 && res.data) {
      let examList = Array.isArray(res.data)
        ? res.data
        : res.data.list
        ? res.data.list
        : [];

      // 如果有试卷，随机选择一套
      if (examList.length > 0) {
        const randomIndex = Math.floor(Math.random() * examList.length);
        examPaper.value = examList[randomIndex];

        // 清除其他试卷数据
        examList = [examList[randomIndex]];
      }
    }
  } catch (error) {
    console.error("获取试卷失败:", error);
    uni.showToast({
      title: "获取试卷失败",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

// 开始考试
const startExam = () => {
  if (!examPaper.value) return;

  uni.navigateTo({
    url: `/pages/test/bankList?pkId=${encodeURIComponent(examPaper.value.pkId)}
    &timeLimit=${encodeURIComponent(examPaper.value.timeLimit || 60)}
    &title=${encodeURIComponent(
      examPaper.value.title || examPaper.value.paperTitle
    )}
    &paperId=${encodeURIComponent(examPaper.value.paperId)}`,
  });
};

onMounted(() => {
  if (props.pkId) {
    getExam();
  }
});
</script>

<style scoped>
.exam-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  font-size: 28rpx;
  color: #333;
}

.right {
  background-color: #32b880;
  border-radius: 45rpx;
  padding: 10rpx 30rpx;
  font-size: 28rpx;
}

.loading,
.no-exam {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  padding: 30rpx;
}

.no-exam {
  background: #fff;
  border-radius: 10px;
}
</style>
