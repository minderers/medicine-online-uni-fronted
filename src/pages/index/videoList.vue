<template>
  <div>
    <Back><slot>视频列表</slot></Back>
    <div class="top border-bottom">
      <div class="type flex justify-items-start align-center mx-3 my-2">
        <div class="icon">
          <image
            src="../../static/index/icon_shipin.png"
            mode="scaleToFill"
            class="h-5 w-5"
          />
        </div>
        <div class="ml-2 title">视频集</div>
      </div>
      <scroll-view class="h-70 scroll-view mx-2" scroll-x="true">
        <div
          v-for="item in videoCollection"
          :key="item.pkId"
          class="itemList mx-2"
        >
          <div class="w-40" @click="toDetail(item)">
            <div class="">
              <image :src="item.cover" mode="scaleToFill" class="h-50 w-40" />
            </div>
            <div class="mx-2">{{ item.title }}</div>
            <div class="flex justify-between align-center m-2">
              <div
                class="tag"
                v-if="item.brief"
                :style="getRandomColor(item.pkId)"
              >
                {{ item.brief }}
              </div>
              <div class="tag2" v-if="!item.brief">{{ item.brief }}</div>
              <div class="icon flex">
                <image
                  src="../../static/index/icon_bf.png"
                  mode="scaleToFill"
                  class="h-3 w-3"
                />
                <div class="text-xs text-gray-500 ml-2">199视频</div>
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <div class="bottom my-4">
      <div
        class="type flex justify-items-start align-center mx-3 my-2 border-bottom"
      >
        <div class="icon">
          <image
            src="../../static/index/icon_shipin.png"
            mode="scaleToFill"
            class="h-5 w-5"
          />
        </div>
        <div class="ml-2 title">视频</div>
      </div>
      <!-- 多级菜单视频列表 -->
      <KnowledgeBase />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import Back from "@/components/back.vue";
import { getSubjectVideoCollection } from "@/service/subject";
import KnowledgeBase from "./components/knowledgeBase.vue";
const props = defineProps({
  pkId: Number,
});
const videoCollection = ref([]);
const getTopVideo = async () => {
  const res = await getSubjectVideoCollection(props.pkId);
  videoCollection.value = res.data;
};
// 定义一个计算属性来返回随机颜色
const getRandomColor = (index) => {
  const colors = ["red", "blue", "green", "orange", "purple"];
  const color = colors[index % colors.length]; // 使用索引来确保每个标签颜色不同
  return {
    borderColor: color,
    color: color, // 文字颜色和边框颜色相同
  };
};
onMounted(() => {
  getTopVideo();
});
const toDetail = (item) => {
  uni.navigateTo({
    url: `/pages/index/videoDetail?pkId=${encodeURIComponent(item.pkId)}`,
  });
};
</script>

<style lang="scss" scoped>
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
.itemList {
  display: inline-block;
  border-radius: 10rpx;
  border: 1px solid #e5e5e5;
}
.scroll-view {
  white-space: nowrap;
  width: 100%;
}
.border-bottom {
  border-bottom: 1px solid #e5e5e5;
}
.title {
  font-size: 36rpx;
}
</style>
