<template>
  <div class="mt-3">
    <Noback>
      <slot>考核列表</slot>
    </Noback>
    <div v-for="item in quizs.list" :key="item.pkId" class="mt-2">
      <div
        class="item m-2 flex justify-between py-5 px-4"
        @click="toDetail(item)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { getQuizList } from "@/service/exam";
import Noback from "@/components/noback.vue";
const toDetail = (item) => {
  uni.navigateTo({
    url: `/pages/test/examList?pkId=${encodeURIComponent(item.pkId)}`,
  });
};
// 分⻚参数封装：当前⻚和每⻚条数
const pageParams = reactive({
  page: 1,
  limit: 10,
});

// 封装资讯数据：数组和总条数
const quizs = reactive({
  list: [],
  total: 0,
});

// 封装获取资讯列表的函数
const getAllQuizs = async () => {
  // 使⽤分⻚参数调⽤接⼝
  const res = await getQuizList(pageParams);
  // 将请求到的数据追加到数组尾部
  quizs.list.push(...res.data.list);
  // 总条数更新
  quizs.total = res.data.total;
};

// 组件挂载的时候加载数据
onMounted(() => getAllQuizs());
1;
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  border-radius: 10rpx;
  background-image: url("https://medicine-online-uni-fronted.oss-cn-hangzhou.aliyuncs.com/bg.png");
}
.cover {
  border-radius: 10rpx;
}
.tag {
  width: 80rpx;
  text-align: center;
  padding: 0 10rpx;
  border-radius: 5px;
  border: 1px solid #f5a623;
  font-size: 20rpx;
  color: #f5a623;
}
.tag2 {
  width: 80rpx;
  text-align: center;
  padding: 0 10rpx;
  border-radius: 5px;
  font-size: 20rpx;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon {
    display: flex;
    align-items: center;
    .left,
    .right {
      display: flex;
      align-items: center;
      margin-left: 10px;
      .number {
        margin-left: 5px;
      }
    }
    .img {
      width: 40rpx;
      height: 30rpx;
    }
  }
}
.text-ellipsis {
  overflow: hidden; /* 确保内容超出容器时会被隐藏 */
  display: -webkit-box; /* 使用弹性盒子布局模型 */
  -webkit-line-clamp: 2; /* 限制在两行 */
  -webkit-box-orient: vertical; /* 垂直排列盒子 */
  text-overflow: ellipsis; /* 多余文本用省略号表示 */
  white-space: normal; /* 使用正常的白空格处理方式，允许换行 */
}
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
