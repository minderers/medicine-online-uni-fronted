<template>
  <div>
    <Back>
      <slot>试卷列表</slot>
    </Back>
    <div v-for="item in Exams" :key="item.pkId" class="mt-2">
      <div class="item m-2 flex justify-between py-5 px-4">
        <div class="left">{{ item.title }}{{ item.paperTitle }}</div>
        <div class="right text-white" @click="toAnswer(item)">立即答题</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import Back from "../../components/back.vue";
import { getExamList } from "@/service/exam";
const props = defineProps({
  pkId: Number,
});
const toAnswer = (item) => {
  uni.navigateTo({
    url: `/pages/test/bankList?pkId=${encodeURIComponent(item.pkId)}
    &timeLimit=${encodeURIComponent(item.timeLimit)}
    &title=${encodeURIComponent(item.title)}
    &paperId=${encodeURIComponent(item.paperId)}`,
  });
};
const Exams = ref([]);
const getExam = async () => {
  const res = await getExamList(props.pkId);
  Exams.value = res.data;
};
onMounted(() => {
  getExam();
});
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  border-radius: 10rpx;
  background-image: url("https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/action_bg.png");
}
.right {
  background-color: #32b880;
  border-radius: 45rpx;
  padding: 5rpx 20rpx;
}
</style>
