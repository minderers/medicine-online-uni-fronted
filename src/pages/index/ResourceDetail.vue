<template>
  <div>
    <Back>
      <slot>详情</slot>
    </Back>
    <div class="video">
      <video
        id="myVideo"
        :src="src"
        :controls="controls"
        :autoplay="autoplay"
        :muted="muted"
        show-mute-btn
        auto-pause-if-open-native="false"
        style="width: 100%; height: 300px"
      ></video>
    </div>
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
    <swiper
      :current="navIndex"
      :duration="150"
      @change="onChangeTab"
      :style="'height:' + scrollH + 'px;padding-bottom:50px'"
    >
      <!-- 简介 -->
      <swiper-item>
        <scroll-view scroll-y="true">
          <div class="text-xl text-center font-weight-bold">{{ title }}</div>
          <div class="icon my-2 justify-end">
            <div class="left">
              <image
                src="../../static/index/icon_chakan.png"
                mode="scaleToFill"
              />
              <div class="text-gray-400 ml-2">{{ currentBrowseNum }}</div>
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
              <div class="text-gray-400 mx-2">{{ currentStarNum }}</div>
            </div>
          </div>
          <div class="my-2">
            <div class="section ml-2 px-2 font-weight-bold">视频介绍</div>
            <div class="text-gray-500 ml-3 my-3">{{ title }}</div>
          </div>
        </scroll-view>
      </swiper-item>
      <!-- 目录 -->
      <swiper-item>
        <scroll-view scroll-y="true">
          <div class="m-4">
            <div class="item flex justify-between my-2">
              <div class="text-xl">
                {{ contentList.title }}
              </div>
              <div class="second text-gray-400 text-sm">
                {{ contentList.second }}
              </div>
            </div>
          </div>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script setup>
import Back from "@/components/back.vue";
import { ref, defineProps, onMounted } from "vue";
import { getCourseDetail } from "@/service/resource";
import { addCollection, deleteCollection } from "@/service/star";
import { getStarList } from "@/service/star";

const navIndex = ref(0);
const isletIndex = ref(0);
const tabBars = ref([{ name: "简介" }, { name: "目录" }]);
const contentList = ref([]);
const src = ref();
const controls = ref(true);
const autoplay = ref(false);
const muted = ref(false);
const isStarred = ref(false);

// 使用 ref 来跟踪当前的浏览量和收藏数
const currentBrowseNum = ref(0);
const currentStarNum = ref(0);

const props = defineProps({
  title: String,
  browseNum: Number,
  starNum: Number,
  pkId: Number,
});

// 初始化数据
onMounted(() => {
  currentBrowseNum.value = props.browseNum;
  currentStarNum.value = props.starNum;
  getVideo();
  checkIsStarred();
  console.log("组件挂载，pkId:", props.pkId);
});

// 点击切换选项卡
const changeTab = async (index) => {
  navIndex.value = index;
};

const checkIndex = (index) => {
  isletIndex.value = index;
};

// 滑动切换选项卡
const onChangeTab = (e) => {
  navIndex.value = e.detail.current;
};

// 获取视频详情
const getVideo = async () => {
  try {
    const res = await getCourseDetail(props.pkId);
    if (res.code === 0 && res.data) {
      src.value = res.data.url;
      contentList.value = res.data;
    }
  } catch (error) {
    console.error("获取视频详情失败:", error);
  }
};

// 检查是否已收藏
const checkIsStarred = async () => {
  try {
    const res = await getStarList({
      type: 2,
      pageNum: 1,
      pageSize: 999,
    });

    if (res.code === 0 && res.data.records) {
      isStarred.value = res.data.records.some(
        (item) => item.contentId === props.pkId
      );
      console.log("收藏状态:", isStarred.value);
    }
  } catch (error) {
    console.error("检查收藏状态失败:", error);
  }
};

// 收藏/取消收藏
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

    const res = isStarred.value
      ? await deleteCollection(props.pkId, "video")
      : await addCollection(props.pkId, "video");

    if (res.code === 0) {
      isStarred.value = !isStarred.value;
      // 更新收藏数
      currentStarNum.value = isStarred.value
        ? currentStarNum.value + 1
        : currentStarNum.value - 1;

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
</style>
