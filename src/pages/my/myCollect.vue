<template>
  <Back><slot>我的收藏</slot></Back>
  <div class="collect-list">
    <div v-for="item in starList" :key="item.pkId" class="collect-item">
      <!-- 使用 getFullImageUrl 处理图片地址 -->
      <img
        v-if="item.info?.cover || item.info2?.cover"
        :src="getFullImageUrl(item.info?.cover || item.info2?.cover)"
        class="cover-image"
      />

      <div class="content">
        <!-- 标题 -->
        <div class="title">
          {{ item.info?.title || item.info2?.title }}
        </div>

        <div class="bottom-info">
          <!-- 标签 -->
          <span class="label">{{ item.info?.label || item.info2?.label }}</span>

          <!-- 浏览量和收藏数 -->
          <div class="stats">
            <span class="views">
              <i class="icon-eye"></i>
              {{ item.info?.browseNum || item.info2?.browseNum }}
            </span>
            <span class="stars">
              <i class="icon-star"></i>
              {{ item.info?.starNum || item.info2?.starNum }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Back from "@/components/back.vue";
import { getStarList } from "@/service/star";
import { ref, onMounted } from "vue";

const starList = ref([]);

// 获取完整的图片URL
const getFullImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `https://medicineonline.oss-cn-hangzhou.aliyuncs.com/${url.trim()}`;
};

const fetchStarList = async () => {
  try {
    console.log("开始请求收藏列表...");
    const res = await getStarList({
      pageNum: 1,
      pageSize: 10,
      deleteFlag: 0,
    }).catch((error) => {
      console.error("请求失败:", error);
      throw error;
    });

    if (!res) {
      throw new Error("返回数据为空");
    }

    console.log("API返回原始数据:", res);

    if (res.code !== 0) {
      throw new Error(`API返回错误: ${res.msg}`);
    }

    starList.value = res.data.records;
    console.log("收藏列表设置成功:", starList.value);
  } catch (error) {
    console.error("获取收藏列表失败:", error);
  }
};

onMounted(() => {
  fetchStarList();
});
</script>

<style scoped>
.collect-list {
  padding: 16px;
}

.collect-item {
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}

.cover-image {
  width: 120px;
  height: 80px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: 16px;
  font-weight: normal;
  line-height: 1.4;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 12px;
  color: #999;
  padding: 2px 6px;
  background-color: #f5f5f5;
  border-radius: 2px;
}

.stats {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 12px;
}

.views,
.stars {
  display: flex;
  align-items: center;
  margin-left: 12px;
}

.icon-eye,
.icon-star {
  margin-right: 4px;
}

.icon-star {
  color: #ffb800;
}
</style>
