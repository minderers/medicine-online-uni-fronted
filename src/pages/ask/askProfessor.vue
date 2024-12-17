<template>
  <Back>提问</Back>
  <view class="p-5">
    <view class="flex items-center">
      <image :src="professor?.avatar" class="avatar" mode="aspectFill" />
      <text class="ml-2 name">{{ professor?.name }}</text>
    </view>
    <view class="mt-2 mb-2" :class="{ 'clamp-text': !isExpanded }">
      <text class="content experience">{{ professor?.experience }}</text>
    </view>
    <view class="flex justify-center" @click="toggleExpand">
      <image
        class="w-5 h-5 transform duration-300 cursor-pointer"
        :class="{ 'rotate-180': !isExpanded }"
        src="../../static/expertBank/icon_xialai@3x.png"
      />
    </view>
    <view class="mt-5">
      <text class="font-semibold text-lg">向{{ professor?.name }}提问</text>
    </view>

    <view class="mt-10 mb-5 border-1 border-solid border-gray-300 rounded-lg">
      <textarea
        v-model="questionText"
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

    <button class="w-50 bg-green-600 text-white mt-4" @click="submitQuestion">
      提交
    </button>
  </view>
</template>

<script setup>
import { ref } from "vue";
import Back from "@/components/back.vue";
import { getProfessorById, addTopic } from "@/service/ask";
import { onLoad } from "@dcloudio/uni-app";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const getProfessorInfo = async () => {
  const res = await getProfessorById(props.id);
  if (res.code === 0) {
    professor.value = res.data;
  }
};

const professor = ref(null);
const isExpanded = ref(true);
const questionText = ref("");
const images = ref([]);
const video = ref(null);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

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

const submitQuestion = async () => {
  try {
    const response = await addTopic(
      props.id,
      questionText.value,
      [...images.value, video.value].filter(Boolean)
    );
    if (response.code === 0) {
      console.log("Question submitted successfully");
      // 清空表单
      questionText.value = "";
      images.value = [];
      video.value = null;
      uni.showToast({
        title: "提交成功",
        icon: "success",
      });
    } else {
      console.error("Failed to submit question", response.message);
      uni.showToast({
        title: "提交失败",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("Error submitting question", error);
    uni.showToast({
      title: "提交出错",
      icon: "none",
    });
  }
};

onLoad(() => getProfessorInfo());
</script>

<style scoped>
.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.experience {
  color: #999;
  display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease-in-out;
  line-clamp: 7;
}

.clamp-text .experience {
  -webkit-line-clamp: unset;
  display: block;
  line-clamp: unset;
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
