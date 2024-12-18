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
        <view
          v-if="topic.img && topic.img.length > 0"
          class="media-preview mt-2"
        >
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
      <view v-if="replies.length" class="pb-20">
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
            <view
              v-if="reply.img && reply.img.length > 0"
              class="media-preview mt-2"
            >
              <image
                v-for="(img, imgIndex) in getFullImageUrls(reply.img)"
                :key="imgIndex"
                :src="img"
                mode="aspectFill"
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
      <view v-else class="p-5 pb-20">暂无回复</view>
    </view>
  </view>
  <view class="fixed-button">
    <navigator :url="'/pages/ask/reply?id=' + props.id">
      <button class="w-50 bg-green-600 text-white">回复问题</button>
    </navigator>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
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

// 获取数据的方法
const getReplyList = async () => {
  try {
    const [replyResponse, topicResponse] = await Promise.all([
      getReplyListById(props.id),
      getTopicById(props.id),
    ]);

    if (replyResponse.code === 0) {
      replies.value = replyResponse.data;
    }

    if (topicResponse.code === 0) {
      topic.value = topicResponse.data;
    }
  } catch (error) {
    console.error("获取回复列表失败:", error);
    uni.showToast({
      title: "获取数据失败",
      icon: "none",
    });
  }
};

// 使用 onShow 替代 onMounted
onShow(() => {
  getReplyList();
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

.fixed-button {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
