<template>
  <Back>问答列表</Back>
  <view v-if="loading">加载中...</view>
  <view v-else-if="error">发生错误: {{ error }}</view>
  <view v-else>
    <view
      v-for="topic in topics"
      :key="topic.pkId"
      class="topic-item p-5 border-b-1 border-gray-300"
    >
      <!-- 用户信息 -->
      <view class="user-info flex items-center mb-2">
        <image
          :src="getFullImageUrl(topic.avatar)"
          class="avatar w-10 h-10 rounded-full mr-3"
        ></image>
        <view>
          <text class="name font-bold">{{ topic.name }}</text>
          <text class="tag text-sm">{{ topic.tag }}</text>
        </view>
      </view>
      <navigator :url="'/pages/ask/replyList?id=' + topic.pkId">
        <!-- 提问内容 -->
        <view class="content mt-2">
          <text>{{ topic.content }}</text>
        </view>

        <!-- 图片或视频预览 -->
        <view v-if="topic.img" class="media-preview mt-2">
          <image
            v-for="(img, index) in getFullImageUrls(topic.img)"
            :key="index"
            :src="img"
            mode="aspectFill"
            class="preview-img w-full max-h-40 object-contain mb-2"
          ></image>
        </view>

        <!-- 提问时间 -->
        <view class="time mt-2 text-gray-500">
          <text>{{ formatDateTime(topic.createTime) }}</text>
        </view>

        <!-- 是否回答 -->
        <view class="status mt-2">
          <text v-if="topic.status === '已回答'" class="text-green-600"
            >已回答</text
          >
          <text v-else class="text-gray-400">未回答</text>
        </view>
      </navigator>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import Back from "@/components/back.vue";
import { getTopicListById } from "@/service/ask";
import { onShow } from "@dcloudio/uni-app";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const topics = ref([]);
const loading = ref(true);
const error = ref(null);

const getTopicList = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 设置请求超时
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("请求超时")), 10000); // 10秒超时
    });

    // 先尝试从缓存获取数据
    const cachedData = uni.getStorageSync(`professor_questions_${props.id}`);
    if (cachedData) {
      topics.value = cachedData;
      loading.value = false;
    }

    // 使用 Promise.race 处理超时
    const res = await Promise.race([
      getTopicListById(props.id),
      timeoutPromise,
    ]);

    if (res.code === 0) {
      topics.value = res.data || [];
      // 更新缓存
      uni.setStorageSync(`professor_questions_${props.id}`, res.data);
    } else {
      throw new Error(res.msg || "获取数据失败");
    }
  } catch (err) {
    console.error("获取话题列表失败:", err);
    error.value = err.message || "获取数据失败";

    // 如果请求失败但有缓存数据，显示提示但保留缓存数据
    if (topics.value.length > 0) {
      uni.showToast({
        title: "网络不佳，显示缓存数据",
        icon: "none",
      });
    }
  } finally {
    loading.value = false;
  }
};

// 使用 onMounted 和 onShow 双重保障
onMounted(() => {
  getTopicList();
});

onShow(() => {
  getTopicList();
});

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return "";

  // 将日期字符串转换为 yyyy-MM-dd 格式
  const date = new Date(dateTime.split(" ")[0]); // 只取日期部分

  try {
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  } catch (err) {
    console.error("日期格式化错误:", err);
    // 如果转换失败，返回原始日期部分
    return dateTime.split(" ")[0];
  }
};

// 获取完整的图片URL
const getFullImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `https://medicineonline.oss-cn-hangzhou.aliyuncs.com/${url.trim()}`;
};

// 获取完整的图片URL数组
const getFullImageUrls = (imgPaths) => {
  if (!imgPaths) return [];
  return imgPaths.split(",").map((path) => getFullImageUrl(path.trim()));
};

// 确保组件卸载时清理
onUnmounted(() => {
  topics.value = [];
  loading.value = false;
  error.value = null;
});
</script>

<style scoped>
.topic-item {
  padding: 15px;
  border-bottom: 1px solid #ccc;
}

.user-info .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info .name {
  font-size: 16px;
  font-weight: bold;
}

.user-info .tag {
  display: inline-block;
  font-size: 12px;
  color: #32b880;
  background-color: white;
  border: 1px solid #32b880;

  padding: 2px 4px;
  border-radius: 4px;
  margin-left: 10px;
  margin-right: 10px;

  position: absolute;
  right: -1px;
}

.content {
  margin-top: 10px;
  font-size: 14px;
  color: #333;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-preview {
  object-fit: contain; /* 确保图片保持其原始比例 */
}

.media-preview .preview-img {
  width: 32%;
  max-height: 100px;
  border-radius: 8px;
  margin-top: 10px;
  margin-right: 2px;
}

.time {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}

.status {
  margin-top: 10px;
  font-size: 12px;
}
</style>
