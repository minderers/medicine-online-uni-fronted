<template>
  <Back>回复</Back>
  <view class="p-5" v-if="topic">
    <view class="pr-5">
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
    <view class="mt-5">
      <text class="font-semibold text-lg">向{{ topic.name }}回复</text>
    </view>

    <view class="mt-10 mb-5 border-1 border-solid border-gray-300 rounded-lg">
      <textarea
        v-model="replyText"
        placeholder="请描述您在学习中遇到的问题"
        class="w-full p-2 mt-2 border rounded"
      ></textarea>
    </view>

    <view class="flex items-center">
      <button @click="uploadImage" class="mr-2 upload-button">
        <image class="w-10 h-8" src="../../static/expertBank/icon_image.png" />
      </button>
      <button @click="uploadVideo" class="upload-button">
        <image class="w-12 h-7" src="../../static/expertBank/icon_video.png" />
      </button>
      <view>
        <text class="text-gray-300">（最多上传九张图或一条视频）</text>
      </view>
    </view>

    <view class="mt-4 flex flex-wrap">
      <view
        v-for="(image, index) in images"
        :key="index"
        class="relative mr-2 mb-2"
      >
        <image :src="image" class="uploaded-image" />
        <button @click="removeImage(index)" class="delete-button">X</button>
      </view>
      <view v-if="video" class="relative mr-2 mb-2">
        <video :src="video" class="uploaded-video" controls></video>
        <button @click="removeVideo" class="delete-button">X</button>
      </view>
    </view>

    <button class="w-50 bg-green-600 text-white mt-4" @click="submitReply">
      提交
    </button>
  </view>
  <view v-else> 加载中... </view>
</template>

<script setup>
import { ref } from "vue";
import Back from "@/components/back.vue";
import { getTopicById, addReply } from "@/service/ask";
import { onLoad } from "@dcloudio/uni-app";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const getTopicInfo = async () => {
  const res = await getTopicById(props.id);
  if (res.code === 0) {
    topic.value = res.data;
  }
};

const topic = ref(null);
const replyText = ref("");
const images = ref([]);
const video = ref(null);

const uploadImage = () => {
  uni.chooseImage({
    count: 9 - images.value.length, // 最多可以选择的图片张数
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      images.value.push(...res.tempFilePaths);
      console.log(images.value);
    },
    fail: (err) => {
      console.error("Failed to choose image", err);
    },
  });
};

const uploadVideo = () => {
  if (video.value) {
    uni.showToast({
      title: "只能上传一个视频",
      icon: "none",
    });
    return;
  }
  uni.chooseVideo({
    sourceType: ["album", "camera"],
    maxDuration: 60,
    camera: "back",
    compressed: true,
    success: (res) => {
      video.value = res.tempFilePath;
      console.log(video.value);
    },
    fail: (err) => {
      console.error("Failed to choose video", err);
    },
  });
};

const removeImage = (index) => {
  images.value.splice(index, 1);
};

const removeVideo = () => {
  video.value = null;
};

const submitReply = async () => {
  try {
    const response = await addReply(
      props.id,
      replyText.value,
      [...images.value, video.value].filter(Boolean)
    );
    if (response && response.code === 0) {
      uni.showToast({
        title: "提交成功",
        icon: "success",
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      uni.showToast({
        title: response?.message || "提交失败",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("Error submitting reply:", error);
    uni.showToast({
      title: "提交出错",
      icon: "none",
    });
  }
};

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

onLoad(() => getTopicInfo());
</script>

<style scoped>
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

.preview-img {
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

.upload-button {
  background-color: transparent;
  border: none;
  padding: 0;
  outline: none;
}

.uploaded-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  position: relative;
}

.uploaded-video {
  width: 100px;
  height: 100px;
  object-fit: cover;
  position: relative;
}

.delete-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
}
</style>
