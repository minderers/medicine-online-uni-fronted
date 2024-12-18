<template>
  <div>
    <Back>浏览记录</Back>
    <div
      class="clear-btn"
      @click="clearHistory"
      v-if="recordList.list.length > 0"
    >
      清空记录
    </div>
    <div class="mt-3">
      <div v-for="item in recordList.list" :key="item.pkId" class="mt-2">
        <div
          class="item mx-2 flex justify-between my-2"
          @click="toDetail(item)"
        >
          <div class="" v-if="item.cover">
            <image
              :src="item.cover"
              mode="aspectFill"
              class="img w-30 h-20 cover mr-2"
            />
          </div>
          <div class="right my-2 mr-3 w-100">
            <div class="text-lg text-ellipsis">{{ item.title }}</div>
            <div class="bottom mt-2">
              <div
                class="tag"
                v-if="item.label"
                :style="getRandomColor(item.pkId)"
              >
                {{ item.label }}
              </div>
              <div class="tag2" v-if="!item.label">{{ item.label }}</div>
              <div class="icon">
                <div class="left">
                  <image
                    src="../../static/index/icon_chakan.png"
                    mode="scaleToFill"
                    class="img"
                  />
                  <div class="text-gray-400 ml-2">{{ item.browseNum }}</div>
                </div>
                <div class="right">
                  <image
                    src="../../static/index/icon_shoucang.png"
                    mode="scaleToFill"
                    class="img"
                  />
                  <div class="text-gray-400 mx-2">{{ item.starNum }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <view class="loading-text">
        {{ finish ? "没有更多数据~" : "正在加载..." }}
      </view>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import Back from "@/components/back.vue";
import { onReachBottom } from "@dcloudio/uni-app";

const pageParams = reactive({
  page: 1,
  limit: 10,
});

const recordList = reactive({
  list: [],
  total: 0,
});

const finish = ref(false);

const getRecordList = async () => {
  if (finish.value === true) {
    return uni.showToast({ icon: "none", title: "没有更多数据~" });
  }

  // 从本地存储获取浏览记录
  const storageHistory = uni.getStorageSync("browseHistory") || [];

  // 计算分页数据
  const start = (pageParams.page - 1) * pageParams.limit;
  const end = start + pageParams.limit;
  const pageData = storageHistory.slice(start, end);

  // 更新列表数据
  recordList.list.push(...pageData);
  recordList.total = storageHistory.length;

  if (recordList.list.length < recordList.total) {
    pageParams.page++;
  } else {
    finish.value = true;
  }
};

const toDetail = (item) => {
  switch (item.type) {
    case "news":
      uni.navigateTo({
        url: `/pages/index/NewsDetail?pkId=${encodeURIComponent(item.pkId)}`,
      });
      break;
    case "resource":
      uni.navigateTo({
        url: `/pages/index/ResourceDetail?title=${encodeURIComponent(
          item.title
        )}&browseNum=${encodeURIComponent(
          item.browseNum
        )}&starNum=${encodeURIComponent(
          item.starNum
        )}&pkId=${encodeURIComponent(item.pkId)}`,
      });
      break;
    case "video":
      uni.navigateTo({
        url: `/pages/index/ResourceDetail?title=${encodeURIComponent(
          item.title
        )}&browseNum=${encodeURIComponent(
          item.browseNum
        )}&starNum=${encodeURIComponent(
          item.starNum
        )}&pkId=${encodeURIComponent(item.pkId)}`,
      });
      break;
    case "book":
      uni.navigateTo({
        url: `/pages/index/bookDetail?title=${encodeURIComponent(
          item.title
        )}&url=${encodeURIComponent(item.url)}&bookId=${encodeURIComponent(
          item.pkId
        )}&cover=${encodeURIComponent(
          item.cover
        )}&totalPage=${encodeURIComponent(item.totalPage)}`,
      });
      break;
    case "podcast":
      uni.navigateTo({
        url: `/pages/index/podcastDetail?title=${encodeURIComponent(
          item.title
        )}&browseNum=${encodeURIComponent(
          item.browseNum
        )}&starNum=${encodeURIComponent(
          item.starNum
        )}&pkId=${encodeURIComponent(item.pkId)}&cover=${encodeURIComponent(
          item.cover
        )}`,
      });
      break;
  }
};

const getRandomColor = (index) => {
  const colors = ["red", "blue", "green", "orange", "purple"];
  const color = colors[index % colors.length];
  return {
    borderColor: color,
    color: color,
  };
};

const clearHistory = () => {
  uni.showModal({
    title: "提示",
    content: "确定要清空所有浏览记录吗？",
    success: function (res) {
      if (res.confirm) {
        // 清空本地存储
        uni.setStorageSync("browseHistory", []);
        // 清空当前列表
        recordList.list = [];
        recordList.total = 0;
        finish.value = true;
        uni.showToast({
          title: "清空成功",
          icon: "success",
        });
      }
    },
  });
};

onMounted(() => getRecordList());
onReachBottom(() => getRecordList());
</script>

<style lang="scss" scoped>
.item {
  border-bottom: 1rpx solid #e5e5e5;
  width: 100%;
  display: flex;
  align-items: center;
}
.cover {
  border-radius: 10rpx;
}
.tag {
  width: 80rpx;
  text-align: center;
  padding: 0 10rpx;
  border-radius: 5px;
  border: 1px solid #f5a623;
  font-size: 20rpx;
  color: #f5a623;
}
.tag2 {
  width: 80rpx;
  text-align: center;
  padding: 0 10rpx;
  border-radius: 5px;
  font-size: 20rpx;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon {
    display: flex;
    align-items: center;
    .left,
    .right {
      display: flex;
      align-items: center;
      margin-left: 10px;
      .number {
        margin-left: 5px;
      }
    }
    .img {
      width: 40rpx;
      height: 30rpx;
    }
  }
}
.text-ellipsis {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  white-space: normal;
}
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
.clear-btn {
  position: absolute;
  right: 30rpx;
  bottom: 50rpx;
  padding: 10rpx 20rpx;
  background-color: #f2f2f2;
  color: #666;
  border-radius: 25rpx;
  font-size: 24rpx;
  z-index: 1;
}
</style>
