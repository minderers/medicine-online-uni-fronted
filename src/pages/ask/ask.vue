<template>
  <view class="h-15"></view>
  <view class="flex justify-between align-center banner bg-white mx-2">
    <view class="back" @click="back">
      <image
        src="../../static/nav/icon_sousuo.png"
        style="height: 40rpx; width: 35rpx"
      />
    </view>
    <view class="content">专家资讯</view>
    <view class="null"></view>
  </view>
  <!-- 子节点展示 -->
  <scroll-view
    scroll-y
    :style="'height:' + scrollH + 'px;'"
    class="left bc-grey"
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCategoryList } from "@/service/ask";

const categories = ref([]);
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
}

function back() {
  // 返回按钮的点击事件处理函数
  console.log("Back button clicked");
}
</script>

<style>
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

.left {
  height: 1500rpx;
  width: 250rpx;
  font-size: 30rpx;
  background-color: #f2f2f2;
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
</style>
