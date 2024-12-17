<template>
  <Back>问题详情</Back>
  <view>
    <view v-if="topic" class="topic-item">
      <view class="px-5">
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
      </view>
    </view>
    <view
      class="mx-5 flex items-center py-3 border-solid border-0 border-b-1 border-gray-300"
    >
      <image
        src="../../static/expertBank/icon_answer.png"
        class="w-5 h-4 mr-3"
      ></image>
      <text class="text-gray-400"> 全部回复 </text>
    </view>
    <view class="px-5">
      <view v-if="replies.length">
        <view v-for="(reply, index) in replies" :key="index">
          <view class="py-3 border-solid border-0 border-b-1 border-gray-300">
            <!-- 用户信息 -->
            <view class="user-info flex items-center mb-2">
              <image
                :src="getFullImageUrl(reply.avatar)"
                class="avatar w-10 h-10 rounded-full mr-3"
              ></image>
              <view>
                <text class="name font-bold">{{ reply.name }}</text>
              </view>
            </view>
            <!-- 回复内容 -->
            <view class="content mt-2">
              <text>{{ reply.content }}</text>
            </view>

            <!-- 图片或视频预览 -->
            <view v-if="reply.img" class="media-preview mt-2">
              <image
                v-for="(img, imgIndex) in getFullImageUrls(reply.img)"
                :key="imgIndex"
                :src="img"
                class="preview-img w-full max-h-40 object-contain mb-2"
              ></image>
            </view>
            <!-- 回复时间 -->
            <view class="time mt-2 text-gray-500">
              <text>{{ formatDateTime(reply.createTime) }}</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="p-5">暂无回复</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getReplyListById, getTopicById } from "@/service/ask";
import Back from "@/components/back.vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const replies = ref([]);
const topic = ref(null);

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

onMounted(async () => {
  try {
    const response = await getReplyListById(props.id);
    const response2 = await getTopicById(props.id);
    replies.value = response.data; // 假设响应数据在data字段中
    topic.value = response2.data;
  } catch (error) {
    console.error("获取回复列表失败:", error);
  }
});
</script>

<style scoped>
.topic-item {
  padding-bottom: 15px;
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
}

.media-preview {
  object-fit: contain; /* 确保图片保持其原始比例 */
}

.media-preview .preview-img {
  width: 100%;
  max-height: 160px;
  border-radius: 8px;
  margin-top: 10px;
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
