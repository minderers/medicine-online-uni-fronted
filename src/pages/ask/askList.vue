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
      </navigator>
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
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Back from "@/components/back.vue";
import { getTopicListById } from "@/service/ask";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const topics = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await getTopicListById(props.id);
    topics.value = response.data; // 假设响应的数据存储在response.data中
  } catch (err) {
    error.value = err.message || "无法获取数据";
  } finally {
    loading.value = false;
  }
});

// 格式化日期时间
const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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
