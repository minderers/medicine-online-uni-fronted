<template>
  <Back>
    <slot>详情</slot>
  </Back>

  <view v-if="props.url" class="content-wrapper">
    <view>
      <swiper class="swiper-container" :circular="true" :current="currentSlide">
        <swiper-item v-for="(image, index) in imageList" :key="index">
          <image :src="image" class="book-image" />
        </swiper-item>
      </swiper>
    </view>

    <view v-if="isShow" class="menu">
      <view class="cover p-4">
        <image :src="props.cover" />
        <view class="ml-5">{{ props.title }}</view>
      </view>
      <view class="menu-item mt-4">
        <view class="px-4">
          <span class="menu-span">目录</span>
        </view>

        <view class="mt-1">
          <scroll-view scroll-y style="height: 1100rpx">
            <view
              class="chapter-item p-4"
              v-for="(item, index) in chapterList"
              :key="index"
              @click="goToPage(item.startPage, index)"
              :class="{ active: activeIndex === index }"
            >
              <view class="chapter">{{ item.title }}</view>
              <view class="page">{{ item.startPage }}</view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <view class="bottom" @click="menu()">目录</view>
  </view>

  <view v-else> 暂无书籍资源 </view>
</template>

<script setup>
import Back from "@/components/back.vue";
import { computed, defineProps, ref, onMounted } from "vue";
import { getBookChapter } from "@/service/resource";

const props = defineProps({
  bookId: Number,
  title: String,
  url: String,
  cover: String,
  totalPage: Number,
});

const imageList = computed(() => {
  if (!props.url) return [];
  const images = [];
  for (let i = 1; i <= props.totalPage; i++) {
    // 动态生成图片路径
    images.push(
      `https://my-bucket-621.oss-cn-beijing.aliyuncs.com/medicine-online/${props.url}${i}.png`
    );
  }
  return images;
});
const isShow = ref(false);
const menu = () => {
  isShow.value = !isShow.value;
};
const chapterList = ref([]);
const getChapter = async () => {
  const res = await getBookChapter(props.bookId);
  if (res.code === 0 && res.data) {
    chapterList.value = res.data;
  }
};
const currentSlide = ref(0);

const activeIndex = ref(0);

const goToPage = (startPage, index) => {
  const pageIndex =
    Math.ceil(startPage / (props.totalPage / imageList.value.length)) - 1;
  currentSlide.value = Math.max(
    0,
    Math.min(imageList.value.length - 1, pageIndex)
  );
  isShow.value = false;
  activeIndex.value = index;
};
onMounted(() => {
  getChapter();
});
</script>

<style scoped>
/* 外层容器，确保相对定位 */
.content-wrapper {
  position: relative; /* 确保 menu 可以相对于它定位 */
}

/* Swiper 样式 */
.swiper-container {
  width: 100%;
  height: 1300rpx;
}

.book-image {
  width: 100%;
  height: 100%;
  border-radius: 10rpx; /* 圆角 */
  z-index: 0;
}

/* 底部按钮样式 */
.bottom {
  background-color: #00a660;
  color: #fff;
  width: 100%;
  height: 110rpx;
  text-align: center;
  line-height: 110rpx;
  position: relative;
  z-index: 1;
}

.menu {
  background-color: #fff;
  width: 80%;
  height: 1410rpx;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.cover {
  display: flex;
  flex-direction: row;
}

.cover image {
  width: 150rpx;
  height: 200rpx;
}

.cover view {
  font-weight: bold;
  font-size: 35rpx;
  margin-top: 60rpx;
}

.menu-span {
  border-bottom: #00a660 8rpx solid;
}

.chapter-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.active {
  background-color: #f2f2f2;
}
</style>
