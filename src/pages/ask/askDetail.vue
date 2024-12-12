<template>
  <Back>专家详情</Back>

  <view class="professor-detail pb-20">
    <view class="professor-info">
      <image
        :src="professor?.avatar"
        class="avatar shadow-md shadow-gray-500"
      ></image>
    </view>
    <view class="">
      <view class="p-5 border-solid border-0 border-b-1 border-gray-300">
        <text class="name">{{ professor?.name }}</text>
        <text class="title ml-2">{{ professor?.title }}</text>
        <view class="pl-5">
          <view class="mt-2">
            <text class="content">单位： {{ professor?.department }}</text>
          </view>
          <view class="mt-2">
            <text class="content">专业方向： {{ professor?.majorField }}</text>
          </view>
          <view class="mt-2">
            <text class="content"> {{ professor?.profession }}</text>
          </view>
        </view>
      </view>

      <view class="p-5 border-solid border-0 border-b-1 border-gray-300">
        <view class="flex items-center">
          <view class="bg-green-600 w-1 h-5 rounded-full mr-3"></view>
          <view>
            <text class="font-black text-lg">履历介绍</text>
          </view>
        </view>
        <view
          class="mt-2 indent-lg px-4 pb-2"
          :class="{ 'clamp-text': !isExpanded }"
        >
          <text class="content experience">{{ professor?.experience }}</text>
        </view>
        <view class="flex justify-center" @click="toggleExpand">
          <image
            class="w-5 h-5 transform duration-300 cursor-pointer"
            :class="{ 'rotate-180': !isExpanded }"
            src="../../static/expertBank/icon_xialai@3x.png"
          />
        </view>
      </view>

      <view class="p-5">
        <view class="flex justify-between">
          <view class="flex items-center">
            <view class="bg-green-600 w-1 h-5 rounded-full mr-3"></view>
            <view>
              <text class="font-black text-lg">专家答疑</text>
            </view>
          </view>
          <view class="flex items-center">
            <navigator :url="'/pages/ask/askList?id=' + professor?.pkId">
              <text>更多</text>
              <image
                class="w-3 h-3"
                src="../../static/expertBank/xiayiye.png"
              />
            </navigator> </view
        ></view>
        <view v-if="professor?.list && professor.list.length > 0">
          <view
            v-for="(item, index) in professor.list"
            :key="index"
            class="p-3 border-solid border-0 border-b-1 border-gray-300"
            ><view>
              <text class="question">{{ item.content }}</text>
            </view>
            <view class="flex justify-between">
              <text class="createTime">{{ item.createTime }}</text>
              <view class="">
                <text v-if="item.status == '已回答'" class="text-green-600">{{
                  item.status
                }}</text>
                <text v-else class="text-gray-400">{{ item.status }}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-else>
          <text class="no-data">暂无问答记录</text>
        </view>
      </view>
    </view>
  </view>
  <view class="fixed-button">
    <navigator :url="'/pages/ask/askProfessor?id=' + professor?.pkId">
      <button class="w-50 bg-green-600 text-white">咨询专家</button>
    </navigator>
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

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

onLoad(() => getProfessorInfo());
</script>

<style scoped>
.professor-info {
  position: relative;
  background-image: url("../../static/expertBank/icon_expert.png");
  background-size: cover; /* 背景图片覆盖整个容器 */
  background-position: center; /* 背景图片居中 */
  padding: 20px;
  text-align: center; /* 居中文本 */
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.title {
  color: #18ad6f;
  margin-bottom: 5px;
}

.experience {
  color: #999;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease-in-out;
  line-clamp: 3;
}

.clamp-text .experience {
  -webkit-line-clamp: unset;
  display: block;
  line-clamp: unset;
}

.content {
  color: #a6a6a6;
}

.qa {
  margin-top: 20px;
}

.qa .title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.question {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.createTime {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.no-data {
  color: #999;
  margin-top: 10px;
}

.fixed-button {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
