<template>
  <Back><slot>我的收藏</slot></Back>
  <div class="collect-list">
    <div
      v-for="item in starList"
      :key="item.pkId"
      class="collect-item"
      @click="toDetail(item)"
    >
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
          <span class="label" :style="getRandomColor(item.pkId)">
            {{ item.info?.label || item.info2?.label }}
          </span>

          <!-- 浏览量和收藏数 -->
          <div class="stats">
            <span class="views">
              <image
                src="../../static/index/icon_chakan.png"
                mode="scaleToFill"
                class="stats-icon"
              />
              {{ item.info?.browseNum || item.info2?.browseNum }}
            </span>
            <span class="stars">
              <image
                src="../../static/index/icon_selectedshoucang.png"
                mode="scaleToFill"
                class="stats-icon"
              />
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

// 添加随机颜色方法
const getRandomColor = (index) => {
  const colors = ["#f5a623", "#4a90e2", "#50e3c2", "#ff5858", "#bd10e0"];
  const color = colors[index % colors.length];
  return {
    borderColor: color,
    color: color,
  };
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

// 添加跳转详情方法
const toDetail = (item) => {
  // 将数字类型映射到对应的路由
  const typeMap = {
    0: {
      route: "/pages/index/banner-msg",
      type: "special",
    },
    1: {
      route: "/pages/index/NewsDetail",
      type: "article",
    },
    2: {
      route: "/pages/index/ResourceDetail",
      type: "video",
    },
    3: {
      route: "/pages/index/podcastDetail",
      type: "podcast",
    },
  };

  const typeInfo = typeMap[item.type];
  if (!typeInfo) {
    console.error("未知内容类型:", item.type);
    uni.showToast({
      title: "未知内容类型",
      icon: "none",
    });
    return;
  }

  // 构造跳转参数
  const params = {
    pkId: item.contentId,
    title: item.info?.title || item.info2?.title,
    browseNum: item.info?.browseNum || item.info2?.browseNum,
    starNum: item.info?.starNum || item.info2?.starNum,
  };

  // 如果是音频类型，额外添加封面参数
  if (item.type === 2) {
    // 音频类型
    params.cover = item.info?.cover || item.info2?.cover;
  }

  // 构造URL参数字符串
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  console.log("跳转信息:", {
    type: item.type,
    typeInfo,
    url: `${typeInfo.route}?${queryString}`,
  });

  // 跳转到详情页
  uni.navigateTo({
    url: `${typeInfo.route}?${queryString}`,
    fail: (err) => {
      console.error("页面跳转失败:", err);
      uni.showToast({
        title: "页面跳转失败",
        icon: "none",
      });
    },
  });
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
  cursor: pointer;
}

.collect-item:active {
  background-color: #f5f5f5;
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
  padding: 2px 6px;
  background-color: transparent;
  border-radius: 5px;
  border: 1px solid;
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
  line-height: 1;
}

.stats-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

.icon-eye,
.icon-star {
  margin-right: 4px;
}

.icon-star {
  color: #ffb800;
}
</style>
