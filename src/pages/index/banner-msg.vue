<template>
  <Back><slot>详情</slot></Back>
  <div class="msg mx-4 border-bottom">
    <div class="">
      <image :src="cover" mode="scaleToFill" class="banner-img" />
    </div>
    <view
      class="mt-2 indent-lg px-4 pb-2"
      :class="{ 'clamp-text': !isExpanded }"
    >
      <text class="content experience">{{ brief || title }}</text>
    </view>
    <view class="flex justify-center" @click="toggleExpand">
      <image
        class="w-5 h-5 transform duration-300 cursor-pointer"
        :class="{ 'rotate-180': !isExpanded }"
        src="../../static/expertBank/icon_xialai@3x.png"
      />
    </view>
  </div>
  <div class="type flex justify-items-start align-center mx-3 my-2">
    <div class="icon">
      <image
        src="../../static/index/icon_yaoqiu.png"
        mode="scaleToFill"
        class="h-5 w-5"
      />
    </div>
    <div class="ml-2 title">学习要求</div>
  </div>
  <div class="claim mx-3 pb-2 border-bottom">{{ claim || title }}</div>
  <div class="book border-bottom py-2">
    <div class="type flex align-center mx-3 my-2 justify-between">
      <div class="flex justify-items-start align-center">
        <div class="icon">
          <image
            src="../../static/index/icon_yuedu.png"
            mode="scaleToFill"
            class="h-5 w-5"
          />
        </div>
        <div class="ml-2 title">学习</div>
      </div>
      <div class="right flex justify-items-end align-center" @click="gotoBook">
        <div class="title">更多</div>
        <div class="icon">
          <image
            src="../../static/index/next.png"
            mode="scaleToFill"
            class="h-5 w-5"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-between align-center mx-3">
      <div v-for="item in bookList" :key="item.pkId">
        <div class="item2" @click="toBook(item)">
          <image :src="item.cover" mode="scaleToFill" class="h-25 w-20" />
          <view class="mask h-5 flex justify-end align-center">
            <div class="left">
              <image
                src="../../static/index/icon_kan.png"
                mode="scaleToFill"
                class="h-3 w-4"
              />
            </div>
            <div class="text-xs text-white mx-2">{{ item.browseNum }}</div>
          </view>
        </div>
      </div>
    </div>
  </div>
  <div class="video border-bottom py-2">
    <div class="type flex align-center mx-3 my-2 justify-between">
      <div class="flex justify-items-start align-center">
        <div class="item2">
          <image
            src="../../static/index/icon_shipin.png"
            mode="scaleToFill"
            class="h-5 w-5"
          />
        </div>
        <div class="ml-2 title">视频</div>
      </div>
      <div class="right flex justify-items-end align-center" @click="gotoVideo">
        <div class="title">更多</div>
        <div class="icon">
          <image
            src="../../static/index/next.png"
            mode="scaleToFill"
            class="h-5 w-5"
          />
        </div>
      </div>
    </div>
    <div class="videoList mx-3">
      <div class="" v-for="item in videoList" :key="item.pkId">
        <div
          class="item mx-2 my-4 border-bottom py-2 flex"
          @click="toVideo(item)"
        >
          <div class="item2">
            <image :src="item.cover" mode="scaleToFill" class="w-30 h-20" />
            <WholeMask />
          </div>
          <div class="w-100 mx-3 my-1">
            <div class="left">
              <div class="text-lg text-e text-ellipsis">{{ item.title }}</div>
            </div>
            <div class="flex justify-between align-center my-2 bottom mt-6">
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
  </div>
  <div class="podcast border-bottom py-2">
    <div class="type flex align-center mx-3 my-2 justify-between">
      <div class="flex justify-items-start align-center">
        <div class="icon">
          <image
            src="../../static/index/icon_yinping.png"
            mode="scaleToFill"
            class="h-5 w-5"
          />
        </div>
        <div class="ml-2 title">音频</div>
      </div>
      <div
        class="right flex justify-items-end align-center"
        @click="gotoPodcast"
      >
        <div class="title">更多</div>
        <div class="icon">
          <image
            src="../../static/index/next.png"
            mode="scaleToFill"
            class="h-5 w-5"
          />
        </div>
      </div>
    </div>
    <div class="podcastList mx-3">
      <div v-for="item in podcastList.slice(0, 3)" :key="item.pkId">
        <div
          class="item2 mx-2 my-4 border-bottom py-2"
          @click="toPodcast(item)"
        >
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
import Navbar from "@/components/navbar.vue";
import Back from "@/components/back.vue";
import { onMounted, ref } from "vue";
import {
  getSubjectBook,
  getSubjectPodcast,
  getSubjectVideo,
} from "@/service/subject";
import WholeMask from "./components/wholeMask.vue";
const gotoBook = () => {
  uni.navigateTo({
    url: `/pages/index/bookList?pkId=${encodeURIComponent(props.pkId)}`,
  });
};
const gotoPodcast = () => {
  uni.navigateTo({
    url: `/pages/index/podcastList?pkId=${encodeURIComponent(props.pkId)}`,
  });
};
const gotoVideo = () => {
  uni.navigateTo({
    url: `/pages/index/videoList?pkId=${encodeURIComponent(props.pkId)}`,
  });
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
const props = defineProps({
  pkId: Number,
  cover: String,
  brief: String,
  claim: String,
  title: String,
});
const bookList = ref([]);
const podcastList = ref([]);
const videoList = ref([]);
const getBookList = async () => {
  const res = await getSubjectBook(props.pkId);
  bookList.value = res.data;
};
const getPodcastList = async () => {
  const res = await getSubjectPodcast(props.pkId);
  podcastList.value = res.data;
};
const getVideoList = async () => {
  const res = await getSubjectVideo(props.pkId);
  videoList.value = res.data;
};
onMounted(() => {
  getBookList();
  getPodcastList();
  getVideoList();
});
const isBriefVisible = ref(false); // 默认不展开

function toggleBriefVisibility() {
  isBriefVisible.value = !isBriefVisible.value;
}

const toVideo = (item) => {
  const query = `title=${encodeURIComponent(
    item.title
  )}&browseNum=${encodeURIComponent(
    item.browseNum
  )}&starNum=${encodeURIComponent(item.starNum)}&pkId=${encodeURIComponent(
    item.pkId
  )}`;
  uni.navigateTo({
    url: `/pages/index/ResourceDetail?${query}`,
  });
};

const toBook = (item) => {
  const query = `title=${encodeURIComponent(
    item.title
  )}&url=${encodeURIComponent(item.url)}&bookId=${encodeURIComponent(
    item.pkId
  )}&cover=${encodeURIComponent(item.cover)}&totalPage=${encodeURIComponent(
    item.totalPage
  )}`;
  uni.navigateTo({
    url: `/pages/index/bookDetail?${query}`,
  });
};
const isExpanded = ref(true);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
const toPodcast = (item) => {
  const query = `title=${encodeURIComponent(
    item.title
  )}&browseNum=${encodeURIComponent(
    item.browseNum
  )}&starNum=${encodeURIComponent(item.starNum)}&pkId=${encodeURIComponent(
    item.pkId
  )}&cover=${encodeURIComponent(item.cover)}`;
  uni.navigateTo({
    url: `/pages/index/podcastDetail?${query}`,
  });
};
</script>

<style scoped>
.experience {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease-in-out;
  line-clamp: 3;
}

.clamp-text .experience {
  -webkit-line-clamp: unset;
  display: block;
  line-clamp: unset;
}
.banner-img {
  width: 100%;
  height: 250rpx;
  border-radius: 10px;
}

.brief {
  overflow: hidden;
  transition: max-height 0.3s ease;
  text-indent: 2em;
  font-size: 34rpx;
}
.claim {
  text-indent: 2em;
  font-size: 34rpx;
}
.title {
  font-size: 34rpx;
}
.brief p {
  margin: 0;
  line-height: 1.5em;
}

.is-collapsed::after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1) 50%
  );
  width: calc(100% - 20px);
  height: 1.5em;
  pointer-events: none;
}
.show-more {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #999;
  cursor: pointer;
}
.xiala {
  width: 50rpx;
  height: 50rpx;
}
.border-bottom {
  border-bottom: 1px solid #ccc;
}
.item2 {
  position: relative;
}
.text-ellipsis {
  overflow: hidden; /* 确保内容超出容器时会被隐藏 */
  display: -webkit-box; /* 使用弹性盒子布局模型 */
  -webkit-line-clamp: 1; /* 限制在两行 */
  -webkit-box-orient: vertical; /* 垂直排列盒子 */
  text-overflow: ellipsis; /* 多余文本用省略号表示 */
  white-space: normal; /* 使用正常的白空格处理方式，允许换行 */
}
.mask {
  position: absolute; /* 绝对定位 */
  bottom: 0;
  width: 100%; /* 遮罩层宽度 */ /* 遮罩层高度 */
  background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明背景 */
  /* 其他样式，如边框、圆角等 */
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
