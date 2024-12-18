<template>
  <Back>
    <slot>详情</slot>
  </Back>
  <div class="news-container">
    <!-- 标题 -->
    <div class="title">{{ newsData.title }}</div>

    <!-- 来源信息 -->
    <div class="source-info">
      <span>来自：{{ newsData.source }}</span>
      <span class="views">{{ newsData.browseNum }}阅读</span>
    </div>

    <!-- 正文内容 -->
    <rich-text :nodes="HTMLcontent" class="content"></rich-text>

    <!-- 收藏按钮 -->
    <div class="action-buttons">
      <div class="share-btn">
        <image src="../../static/index/icon_fx.png" mode="scaleToFill" />
        <text>分享</text>
      </div>
      <div class="star-btn" @click="addCollections">
        <image
          :src="
            isStarred
              ? '../../static/index/icon_selectedshoucang.png'
              : '../../static/index/icon_shouc1.png'
          "
          mode="scaleToFill"
        />
        <text>收藏</text>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import Back from "@/components/back.vue";
import { getNewsDetail } from "@/service/news";
import { addCollection, deleteCollection, getStarList } from "@/service/star";

const props = defineProps({
  pkId: Number,
  title: String,
  browseNum: Number,
  starNum: Number,
});

const HTMLcontent = ref("");
const newsData = ref({});
const isStarred = ref(false);

// 获取详情内容
const getDetail = async () => {
  try {
    const res = await getNewsDetail(props.pkId);
    if (res.code === 0 && res.data) {
      newsData.value = res.data;
      // 处理空格
      const contentWithHandledSpaces = res.data.content.replace(
        /　/g,
        '<span data-text="　"></span>'
      );
      HTMLcontent.value = contentWithHandledSpaces;
    }
  } catch (error) {
    console.error("获取新闻详情失败:", error);
  }
};

// 检查是否已收藏
const checkIsStarred = async () => {
  try {
    const res = await getStarList({
      type: 0, // 新闻类型为0
      pageNum: 1,
      pageSize: 999,
    });

    if (res.code === 0 && res.data.records) {
      isStarred.value = res.data.records.some(
        (item) => item.contentId === props.pkId
      );
    }
  } catch (error) {
    console.error("检查收藏状态失败:", error);
  }
};

// 收藏/取消收藏
const addCollections = async () => {
  try {
    if (!props.pkId) {
      uni.showToast({
        title: "参数错误",
        icon: "error",
      });
      return;
    }

    const res = isStarred.value
      ? await deleteCollection(props.pkId, "article")
      : await addCollection(props.pkId, "article");

    if (res.code === 0) {
      isStarred.value = !isStarred.value;
      // 重新获取最新数据
      getDetail();

      uni.showToast({
        title: isStarred.value ? "收藏成功" : "取消收藏",
        icon: "success",
      });
    }
  } catch (error) {
    console.error("收藏操作失败:", error);
    uni.showToast({
      title: "操作失败",
      icon: "error",
    });
  }
};

onMounted(() => {
  getDetail();
  checkIsStarred();
});
</script>

<style lang="scss" scoped>
.news-container {
  padding: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  line-height: 1.4;
  margin-bottom: 20rpx;
}

.source-info {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 24rpx;
  margin-bottom: 30rpx;
}

.content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
  margin-bottom: 100rpx;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  padding: 20rpx;
  background: #3fb583;
  border-radius: 100rpx 0 0 100rpx;

  .share-btn,
  .star-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 30rpx;

    image {
      width: 40rpx;
      height: 40rpx;
      margin-bottom: 8rpx;
    }

    text {
      color: white;
      font-size: 24rpx;
    }
  }
}
</style>
