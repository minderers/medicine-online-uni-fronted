<template>
  <div>
    <Back><slot>音频列表</slot></Back>
    <div class="podcastList mx-3">
      <div v-for="item in podcastList" :key="item.pkId">
        <div class="item m-2 border-bottom py-2">
          <div class="left">
            <div class="text-xl">{{ item.title }}</div>
          </div>
          <div class="flex justify-between align-center my-2">
            <div
              class="tag"
              v-if="item.label"
              :style="getRandomColor(item.pkId)"
            >
              {{ item.label }}
            </div>
            <div class="tag2" v-if="!item.label">{{ item.label }}</div>
            <div class="icon flex">
              <image
                src="../../static/index/icon_bf.png"
                mode="scaleToFill"
                class="h-3 w-3"
              />
              <div class="text-xs text-gray-500 ml-2">
                {{ item.browseNum }}播放
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Back from "@/components/back.vue";
import { ref, onMounted } from "vue";
import { getSubjectPodcast } from "@/service/subject";
// 定义一个计算属性来返回随机颜色
const getRandomColor = (index) => {
  const colors = ["red", "blue", "green", "orange", "purple"];
  const color = colors[index % colors.length]; // 使用索引来确保每个标签颜色不同
  return {
    borderColor: color,
    color: color, // 文字颜色和边框颜色相同
  };
};
const props = defineProps({
  pkId: Number,
});
const podcastList = ref([]);
const getPodcastList = async () => {
  const res = await getSubjectPodcast(props.pkId);
  podcastList.value = res.data;
};
onMounted(() => {
  getPodcastList();
});
</script>

<style lang="scss" scoped>
.border-bottom {
  border-bottom: 1px solid #ccc;
}
.tag {
  text-align: center;
  padding: 0 10rpx;
  border-radius: 5px;
  border: 1px solid #f5a623;
  font-size: 24rpx;
  color: #f5a623;
}
.tag2 {
  text-align: center;
  padding: 0 10rpx;
  border-radius: 5px;
  font-size: 24rpx;
}
</style>
