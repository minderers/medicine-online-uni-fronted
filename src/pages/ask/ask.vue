<template>
  <view class="container">
    <view class="search">
      <view class="h-15"></view>
      <view class="flex justify-between align-center banner bg-white mx-2">
        <view class="back">
          <navigator url="/pages/ask/askSearch">
            <image
              src="../../static/nav/icon_sousuo.png"
              style="height: 40rpx; width: 35rpx"
            />
          </navigator>
        </view>
        <view class="content">专家资讯</view>
        <view class="null"></view>
      </view>
    </view>
    <!-- 子节点展示 -->
    <view class="flex">
      <scroll-view
        scroll-y
        :style="'height:' + scrollH + 'px;'"
        class="left bc-grey no-scroll-bar"
      >
        <view v-for="category in categories" :key="category.pkId">
          <view
            @click="toggleCategory(category)"
            :class="
              category.isOpen || category.isSelected ? 'selected' : 'tab-item'
            "
          >
            {{ category.name }}
          </view>
          <view v-show="category.isOpen" class="child-list">
            <view
              v-for="child in category.childCategory"
              :key="child.pkId"
              :class="child.isSelected ? 'item-selected' : 'item-noSelected'"
              @click.stop="selectChild(category, child)"
            >
              {{ child.name }}
            </view>
          </view>
        </view>
      </scroll-view>
      <!-- 专家列表展示 -->
      <scroll-view
        scroll-y
        :style="'height:' + scrollH + 'px;'"
        class="right bc-white no-scroll-bar"
      >
        <view v-if="professors.length === 0" class="no-data">暂无数据</view>
        <view class="professor-grid">
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
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCategoryList, getProfessorList } from "@/service/ask";

const categories = ref([]);
const professors = ref([]);
const scrollH = ref(0);

onMounted(() => {
  fetchCategories();
  uni.getSystemInfo({
    success: (res) => {
      scrollH.value = res.windowHeight - res.statusBarHeight;
    },
  });
});

async function fetchCategories() {
  try {
    const response = await getCategoryList();
    if (response.code === 0) {
      // 初始化每个类别的 isOpen 和 isSelected 状态为 false
      categories.value = response.data.map((category) => ({
        ...category,
        isOpen: false,
        isSelected: false,
        childCategory: category.childCategory.map((child) => ({
          ...child,
          isSelected: false,
        })),
      }));

      // 默认选中第一个父节点下的第一个子节点
      if (
        categories.value.length > 0 &&
        categories.value[0].childCategory.length > 0
      ) {
        categories.value[0].isOpen = true;
        categories.value[0].isSelected = true;
        categories.value[0].childCategory[0].isSelected = true;
        fetchProfessors(
          categories.value[0],
          categories.value[0].childCategory[0]
        );
      }
    } else {
      console.error("Failed to fetch categories:", response.message);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

function toggleCategory(category) {
  // 如果当前类别是打开的，则关闭它
  if (category.isOpen) {
    category.isOpen = false;
    category.isSelected = false;
  } else {
    // 关闭所有其他类别
    categories.value.forEach((cat) => {
      cat.isOpen = false;
      cat.isSelected = false;
      cat.childCategory.forEach((child) => (child.isSelected = false));
    });
    // 打开当前类别
    category.isOpen = true;
    category.isSelected = true;
  }
}

function selectChild(category, child) {
  // 清除当前父节点下所有子节点的选中状态
  category.childCategory.forEach((c) => (c.isSelected = false));

  // 设置当前点击的子节点为选中状态
  child.isSelected = true;

  // 获取专家列表
  fetchProfessors(category, child);
}

async function fetchProfessors(category, child) {
  try {
    const response = await getProfessorList({
      categoryId: child.pkId,
      page: 1,
      limit: 10,
      order: null,
      asc: true,
    });

    if (response.code === 0) {
      professors.value = response.data.list;
    } else {
      console.error("Failed to fetch professors:", response.message);
    }
  } catch (error) {
    console.error("Error fetching professors:", error);
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.banner {
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  margin-left: 2%;
  margin-right: 2%;
}

.content {
  font-size: 32rpx;
}

.flex {
  display: flex;
  flex: 1;
}

.left {
  height: 100%;
  width: 250rpx;
  font-size: 30rpx;
  background-color: #f2f2f2;
}

.right {
  height: 100%;
  width: calc(100% - 260rpx);
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #fff;
}

.tab-item {
  padding: 25rpx;
}

.selected {
  padding: 25rpx;
  color: #32b880;
  background-color: #fff;
  border-left: #32b880 10rpx solid;
}

.tab-content {
  cursor: pointer;
}

.child-list {
  background-color: #fff;
}

.item-noSelected {
  padding: 25rpx;
  cursor: pointer;
}

.item-selected {
  padding: 25rpx;
  color: #fff;
  background-color: #95c9b3;
}

.bc-white {
  background-color: #fff;
}

.bc-grey {
  background-color: #f2f2f2;
}

.bc-green {
  background-color: #95c9b3;
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

/* 隐藏滚动条 */
.no-scroll-bar ::-webkit-scrollbar {
  display: none;
}

.no-scroll-bar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
