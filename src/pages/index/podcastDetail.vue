<template>
  <div>
    <Back>
      <slot>详情</slot>
    </Back>
    <Podcast
      :currentAudioUrl="currentAudioUrl"
      :currentAudioDuration="currentAudioDuration"
      :cover="newCover"
      playIcon="../../../static/index/audio_pause.png"
      pauseIcon="../../../static/index/audio_play.png"
    />

    <view
      ref="tabBar"
      class="flex pt-3 px-3 bg-white justify-start font-weight-bold text-gray-400"
    >
      <view
        v-for="(item, index) in tabBars"
        :key="index"
        :class="navIndex === index ? 'activite' : ''"
        class="pb-2 ml-4"
        @click="changeTab(index)"
      >
        {{ item.name }}
      </view>
    </view>

    <!-- 简介部分 -->
    <view v-show="navIndex === 0">
      <scroll-view scroll-y="true">
        <div class="text-xl text-center font-weight-bold">{{ title }}</div>
        <div class="icon my-2 justify-end">
          <div class="left">
            <image
              src="../../static/index/icon_chakan.png"
              mode="scaleToFill"
            />
            <div class="text-gray-400 ml-2">{{ browseNum }}</div>
          </div>
          <div class="right" @click="addCollections">
            <image
              :src="
                isStarred
                  ? '../../static/index/icon_selectedshoucang.png'
                  : '../../static/index/icon_shoucang.png'
              "
              mode="scaleToFill"
            />
            <div class="text-gray-400 mx-2">{{ starNum }}</div>
          </div>
        </div>
        <div class="my-2">
          <div class="section ml-2 px-2 font-weight-bold">音频介绍</div>
          <div class="text-gray-500 ml-3 my-3">{{ title }}</div>
        </div>
      </scroll-view>
    </view>

    <!-- 目录部分 -->
    <view v-show="navIndex === 1">
      <scroll-view scroll-y="true">
        <div>
          <div
            class="item flex justify-between p-2"
            v-for="(audioItem, index) in contentList"
            :key="audioItem.pkId"
            @click="changeAudio(index)"
            :class="{ grey: selectedIndex === index }"
          >
            <div class="font">{{ audioItem.title }}</div>
            <div class="second text-gray-400 text-sm">
              {{ formatTime(audioItem.length) }}
            </div>
          </div>
        </div>
      </scroll-view>
    </view>
  </div>
</template>

<script setup>
import Back from "@/components/back.vue";
import { ref, defineProps, onMounted } from "vue";
import { getPodcastDetail } from "@/service/resource";
import Podcast from "./components/podcast.vue";
import { addCollection, deleteCollection } from "@/service/star";

const navIndex = ref(0); // 用于控制选项卡切换
const tabBars = ref([{ name: "简介" }, { name: "目录" }]);

// 当前播放音频的 URL
const currentAudioUrl = ref("");
const currentAudioDuration = ref(0);
const newCover = ref("");
// 点击切换选项卡
const changeTab = async (index) => {
  navIndex.value = index;
};

// 音频详情相关的状态
const contentList = ref([]);
const props = defineProps({
  title: String,
  browseNum: Number,
  starNum: Number,
  pkId: Number,
  cover: String,
});

// 获取音频的详细信息
const getAudio = async () => {
  const res = await getPodcastDetail(props.pkId);
  if (res.code === 0 && res.data) {
    contentList.value = res.data;
    // 默认设置第一个音频的 URL 作为当前播放的音频
    currentAudioUrl.value = res.data[0].url;
    currentAudioDuration.value = res.data[0].length;
    newCover.value = props.cover;
  }
};

onMounted(() => {
  getAudio();
  console.log("组件挂载，pkId:", props.pkId);
});

const selectedIndex = ref(0);
// 切换音频并自动播放
const changeAudio = (index) => {
  currentAudioUrl.value = contentList.value[index].url;
  currentAudioDuration.value = contentList.value[index].length;
  selectedIndex.value = index;
};

// 格式化时间为 hh:mm:ss 格式
const formatTime = (time) => {
  const hours = Math.floor(time / 3600) // 计算小时
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60) // 剩余时间计算分钟
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60) // 剩余时间计算秒数
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const isStarred = ref(false);
const addCollections = async () => {
  try {
    if (!props.pkId) {
      console.error("pkId is missing:", props.pkId);
      uni.showToast({
        title: "参数错误",
        icon: "error",
      });
      return;
    }

    console.log("调用收藏接口，参数：", {
      contentId: props.pkId,
      type: "podcast",
      currentStatus: isStarred.value,
    });

    const res = isStarred.value
      ? await deleteCollection(props.pkId, "podcast")
      : await addCollection(props.pkId, "podcast");

    console.log("收藏接口返回：", res);

    if (res.code === 0) {
      isStarred.value = !isStarred.value;
      uni.showToast({
        title: isStarred.value ? "收藏成功" : "取消收藏",
        icon: "success",
      });
    } else {
      uni.showToast({
        title: res.msg || "操作失败",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("收藏操作失败:", error);
    uni.showToast({
      title: error.message || "操作失败",
      icon: "error",
    });
  }
};
</script>

<style lang="scss" scoped>
.section {
  border-left: #32b880 solid 12rpx;
  border-radius: 10rpx;
}
.activite {
  color: #32b880;
  border-bottom: #32b880 solid 4rpx;
}

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
  image {
    width: 40rpx;
    height: 30rpx;
  }
}

.h {
  height: 1500rpx;
}

.font {
  font-size: rpx;
}

.grey {
  background-color: #f2f2f2; /* 灰色背景 */
}
</style>
