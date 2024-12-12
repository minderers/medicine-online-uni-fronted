<template>
  <Back>提问</Back>
  <view class="p-5">
    <view class="flex items-center">
      <image :src="professor?.avatar" class="avatar" />
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
      <view class="mr-2">
        <image class="w-10 h-8" src="../../static/expertBank/icon_image.png" />
      </view>
      <view>
        <image class="w-12 h-7" src="../../static/expertBank/icon_video.png" />
      </view>
      <view>
        <text class="text-gray-300">（最多上传九张图或一条视频）</text>
      </view>
    </view>

    <button class="w-50 bg-green-600 text-white mt-4">提交</button>
  </view>
</template>

<script setup>
import { ref } from "vue";
import Back from "@/components/back.vue";
import { getProfessorById } from "@/service/ask";
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

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
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

.file-input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
