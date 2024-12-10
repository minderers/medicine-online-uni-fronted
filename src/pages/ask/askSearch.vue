<template>
  <view>
    <Back>搜索</Back>
    <view class="flex items-center p-1 rounded-full searchbox mx-3">
      <image src="../../static/nav/search.png" class="h-10 w-10" />
      <input
        type="text"
        v-model="searchName"
        placeholder="搜索"
        class="bg-transparent outline-none flex-grow"
        @confirm="handleSearch"
      />
      <image
        v-if="searchName"
        src="../../static/search/delete.png"
        class="h-5 w-5 cursor-pointer"
        @click="clearSearch"
      />
    </view>
    <view v-if="loading" class="flex justify-center mt-20">
      <text>Loading...</text>
    </view>
    <view v-else-if="professors.length === 0 && !loading">
      <image
        src="../../static/search/noContent.png"
        class="h-40 object-contain flex justify-center mt-20"
      />
      <view class="flex justify-center text-gray-400">还没有内容</view>
    </view>
    <view v-else class="professor-grid">
      <view
        v-for="professor in professors"
        :key="professor.pkId"
        class="professor-item border-1 border-solid border-gray-300 rounded-lg"
      >
        <view class="avatar-container">
          <image :src="professor.avatar" class="avatar" />
        </view>
        <view class="info">
          <view class="name">{{ professor.name }}</view>
          <view class="brief">{{ professor.brief }}</view>
          <view class="major-field">{{ professor.majorField }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Back from "@/components/back.vue";
import { ref } from "vue";
import { getProfessorListByName } from "@/service/ask";

const searchName = ref("");
const professors = ref([]);
const loading = ref(false);

/**
 * 处理搜索操作
 */
async function handleSearch() {
  if (!searchName.value.trim()) {
    console.warn("请输入有效的搜索关键词");
    return;
  }

  loading.value = true;
  try {
    const response = await getProfessorListByName(searchName.value);
    if (response.code === 0) {
      professors.value = response.data;
    } else {
      console.error("Failed to fetch professors:", response.msg);
      professors.value = [];
    }
  } catch (error) {
    console.error("Error fetching professors:", error);
    professors.value = [];
  } finally {
    loading.value = false;
  }
}

/**
 * 清空搜索框和查询数据
 */
function clearSearch() {
  searchName.value = "";
  professors.value = [];
}
</script>

<style scoped>
.searchbox {
  background-color: #f5f6fa;
  position: relative;
}

.no-data {
  text-align: center;
  padding: 20rpx;
  color: #999;
}

.professor-grid {
  display: flex;
  flex-wrap: wrap;
}

.professor-item {
  width: 47%;
  margin: 1%;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  padding: 20rpx;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
}

.brief {
  font-size: 28rpx;
  color: #999;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 10rpx;
  line-clamp: 3;
}

.major-field {
  display: inline-flex;
  font-size: 28rpx;
  color: #32b880;
  background-color: #e6f7ff;
  padding: 10rpx;
  border-radius: 10rpx;
  margin-top: 10rpx;
}

/* 关闭图标样式 */
.close-icon {
  position: absolute;
  right: 10rpx;
  top: 50%;
  transform: translateY(-50%);
}
</style>
