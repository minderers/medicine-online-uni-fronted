<template>
  <back>
    <slot>搜索</slot>
  </back>

  <div class="mx-5 p-2 text-gray-400 sousuo">
    <image
      src="/static/nav/icon_sousuo.png"
      mode="scaleToFill"
      class="search-icon"
    />
    <span>
      <input
        v-model="searchTitle"
        placeholder="输入关键字搜索"
        @confirm="handleSearch"
        style="
          color: black;
          border: none;
          background-color: transparent;
          padding: 5px 10px;
        "
      />
    </span>
    <image
      v-if="searchTitle"
      src="/static/nav/delete.png"
      mode="scaleToFill"
      class="delete-icon"
      @click="clearSearch"
    />
  </div>

  <div class="resourceList">
    <scroll-view scroll-x class="scroll-view" show-scrollbar>
      <view
        class="scroll-view-item"
        v-for="item in selectList"
        :key="item.pkId"
        :class="{
          active: selectParams.resType === item.pkId,
        }"
        @tap="handleSelectChange(item.pkId)"
      >
        {{ item.title }}
      </view>
    </scroll-view>

    <noData v-if="isNoData" />

    <div v-if="search.list.length > 0" class="resourceList">
      <div
        v-for="result in search.list"
        :key="result.pkId"
        class="search-result-item"
        @click="toDetail(result)"
      >
        <view v-if="result.leixing === 1" class="leixing1">
          <image :src="result.cover" mode="scaleToFill" class="subject-img" />
          <text class="mx-2" style="font-size: 35rpx">{{ result.title }}</text>

          <view class="bottom m-2">
            <text class="subject-tag" :style="getRandomColor(result.pkId)">{{
              result.label
            }}</text>
            <view class="icon">
              <view class="browse-num">
                <image
                  src="@/static/index/icon_chakan.png"
                  mode="scaleToFill"
                />
                <text class="text-gray-400 ml-2">{{ result.browseNum }}</text>
              </view>
              <view class="star-num">
                <image
                  src="@/static/index/icon_shoucang.png"
                  mode="scaleToFill"
                />
                <text class="text-gray-400 mx-2">{{ result.starNum }}</text>
              </view>
            </view>
          </view>
        </view>

        <div v-else class="mt-2">
          <div class="item mx-2 flex justify-between my-2">
            <div class="" v-if="result.cover">
              <image :src="result.cover" class="img w-30 h-20 cover mr-2" />
            </div>
            <div class="right my-2 mr-3 w-100">
              <div class="text-lg text-ellipsis">{{ result.title }}</div>
              <div class="bottom mt-2">
                <div
                  class="tag"
                  v-if="result.label"
                  :style="getRandomColor(result.pkId)"
                >
                  {{ result.label }}
                </div>
                <div class="tag" v-if="!result.label">{{ result.label }}</div>
                <div class="icon">
                  <div class="left">
                    <image
                      src="@/static/index/icon_chakan.png"
                      mode="scaleToFill"
                      class="img"
                    />
                    <div class="text-gray-400 ml-2">{{ result.browseNum }}</div>
                  </div>
                  <div class="right">
                    <image
                      src="@/static/index/icon_shoucang.png"
                      mode="scaleToFill"
                      class="img"
                    />
                    <div class="text-gray-400 mx-2">{{ result.starNum }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <view class="loadingLayout" v-if="finish">
    <uni-load-more :status="finish ? 'noMore' : 'loading'" />
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import Back from "@/components/back";
import { getSearchContent } from "@/service/search";
import { onReachBottom } from "@dcloudio/uni-app";
import noData from "@/components/noData";
const selectParams = ref({
  resType: 0,
});
const selectList = [
  {
    pkId: 0,
    title: "全部",
  },
  {
    pkId: 1,
    title: "专题",
  },
  {
    pkId: 2,
    title: "资讯",
  },
  {
    pkId: 3,
    title: "视频",
  },
  {
    pkId: 4,
    title: "音频",
  },
];

// 分⻚参数封装：当前⻚和每⻚条数
const pageParams = reactive({
  pageNum: 1,
  pageSize: 5,
});

const search = ref({
  list: [],
  total: 0,
});

const searchTitle = ref("");

const searchResults = ref([]);

const finish = ref(false);
const isNoData = ref(true);

const handleSearch = () => {
  onSearch();
  console.log("搜索关键字:", searchTitle.value);
  // 这里可以添加更多的搜索逻辑，比如调用API
};

const onSearch = async () => {
  // // 退出加载，弹出 toast
  // uni.showLoading({
  //   title: "加载中...",
  // });
  // if (finish.value) {
  //   uni.showToast({
  //     title: "没有更多数据了",
  //     icon: "none",
  //   });
  //   return;
  // }

  let title = searchTitle.value;
  let type = selectParams.value.resType;

  // 添加判断逻辑，当搜索标题为空字符串时，直接返回，不发起请求
  if (title === "") {
    // 重置搜索结果和分页参数
    resetSearch();
    return;
  }
  resetSearch();
  try {
    const response = await getSearchContent({
      title,
      leixing: type,
      pageParams,
    });

    console.log("pageParams", pageParams);

    if (response.data.records.length === 0) {
      isNoData.value = true;
    } else {
      isNoData.value = false;
    }

    // // 分页
    // search.value.list = response.data.records;

    // searchResults.value = response.data.records;
    console.log("response.data", response.data);

    search.value.list.push(...response.data.records);
    // 总条数更新
    console.log("search.list.length", search.value.list.length);
    search.value.total = response.data.total;
    console.log("search.value.total", search.value.total);

    if (search.value.list.length < search.value.total) {
      pageParams.page++;
    } else {
      finish.value = true;
    }
  } catch (error) {
    console.error("搜索请求出错:", error);
  }
  // 退出加载，弹出 toast
  if (finish.value === true) {
    uni.showToast({ icon: "none", title: "没有更多数据~" });
  }
};

// 分类,每换一个标签就请求一次
const handleSelectChange = (pkId) => {
  selectParams.value.resType = pkId;
  console.info("pkId", pkId);
  onSearch();
};

// 定义一个计算属性来返回随机颜色
const getRandomColor = (index) => {
  const colors = ["red", "blue", "green", "orange", "purple"];
  const color = colors[index % colors.length]; // 使用索引来确保每个标签颜色不同
  return {
    borderColor: color,
    color: color, // 文字颜色和边框颜色相同
  };
};

const clearSearch = () => {
  searchTitle.value = "";
};

const resetSearch = () => {
  // 重置搜索标题为空字符串
  // searchTitle.value = "";
  // 重置搜索结果列表为空数组
  searchResults.value = [];
  // 重置分页参数为初始值
  pageParams.pageNum = 1;
  pageParams.pageSize = 5;
  // 重置是否完成加载的标识为false，表示还可以继续加载数据
  finish.value = false;
  // 新增的表示无数据的标识也重置为false
  isNoData.value = true;
  // 清空search.list
  search.value.list = [];
};

// 组件挂载的时候加载数据
onMounted(() => {
  resetSearch();
  onSearch();
});
// ⻚⾯触底加载数据
onReachBottom(() => {
  if (!finish.value) {
    onSearch();
  }
});

// 添加跳转详情方法
const toDetail = (item) => {
  // 保存浏览记录
  let history = uni.getStorageSync("browseHistory") || [];

  // 构造浏览记录对象
  const record = {
    pkId: item.pkId,
    title: item.title,
    cover: item.cover,
    label: item.label,
    browseNum: item.browseNum || 0,
    starNum: item.starNum || 0,
    type: item.leixing === 2 ? "news" : "resource", // 根据 leixing 判断类型
  };

  // 检查是否已存在相同记录
  const existIndex = history.findIndex((h) => h.pkId === item.pkId);
  if (existIndex !== -1) {
    history.splice(existIndex, 1);
  }

  // 将新记录添加到开头
  history.unshift(record);

  // 限制记录数量为50
  if (history.length > 50) {
    history = history.slice(0, 50);
  }

  // 保存到本地存储
  uni.setStorageSync("browseHistory", history);

  // 根据不同类型跳转到对应页面
  switch (
    item.leixing // 使用 leixing 而不是 resType
  ) {
    case 1: // 专题
      uni.navigateTo({
        url: `/pages/index/banner-msg?pkId=${encodeURIComponent(
          item.pkId
        )}&cover=${encodeURIComponent(item.cover)}&title=${encodeURIComponent(
          item.title
        )}`,
      });
      break;
    case 2: // 新闻
      uni.navigateTo({
        url: `/pages/index/NewsDetail?pkId=${encodeURIComponent(item.pkId)}`,
      });
      break;
    case 3: // 视频资源
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
    case 4: // 音频
      const query = `title=${encodeURIComponent(
        item.title
      )}&browseNum=${encodeURIComponent(
        item.browseNum
      )}&starNum=${encodeURIComponent(item.starNum)}&pkId=${encodeURIComponent(
        item.pkId
      )}&cover=${encodeURIComponent(item.cover)}`;
      uni.navigateTo({
        url: `/pages/index/podcastDetail?${query}`,
      });
      break;
    default:
      console.error("未知内容类型:", item.leixing);
      uni.showToast({
        title: "未知内容类型",
        icon: "none",
      });
  }
};
</script>

<style lang="scss" scoped>
.sousuo {
  background-color: #f2f2f2;
  border-radius: 20px;
  display: flex;
  align-items: center;
  height: 20px;
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-left: 5px;
}

.delete-icon {
  width: 20px;
  height: 20px;
  position: absolute; /* 绝对定位 */
  right: 30px; /* 距离右侧10px */
}

.scroll-view {
  display: flex;
  overflow-x: auto; // 允许水平滚动
  white-space: nowrap; // 禁止换行
  margin-top: 10px; // 上边距
}

.scroll-view-item {
  display: inline-block;
  font-size: 12px; // 字体大小
  color: #ffffff; // 字体颜色
  margin-left: 15px;
  padding: 3px 8px; // 内边距
  border-radius: 5px; // 圆角
  background-color: #b1aeae; // 背景颜色
}

.scroll-view-item.active {
  background-color: #4caf50; // 选中状态的背景颜色
  color: #ffffff; // 选中状态的字体颜色
}

.search-result-item {
  // padding: 10px;
  // border-bottom: 1px solid #e5e5e5; // 结果项的底部边框
  text-align: left;
}

.subject-img {
  width: 100%;
  height: 250rpx;
  border-radius: 10px 10px 0 0;
}

.leixing1 {
  background: #fff;
  border-radius: 10px;
  margin: 10px;
  box-sizing: border-box;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.15);
  .subject-img {
    width: 100%;
    height: 250rpx;
    border-radius: 10px 10px 0 0;
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .subject-tag {
      padding: 2px;
      border-radius: 5px;
      border: 1px solid;
      font-size: 25rpx;
      margin-bottom: 20rpx;
    }
    .icon {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      position: absolute; /* 绝对定位 */
      right: 25px;
      .browse-num,
      .star-num {
        display: flex;
        align-items: center;
        margin-left: 10px;
        font-size: 10px;
      }
      image {
        width: 30rpx;
        height: 20rpx;
      }
    }
  }
}

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
  text-align: center;
  padding: 0 10rpx;
  border-radius: 5px;
  font-size: 25rpx;
  border: 1px solid;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon {
    display: flex;
    align-items: center;
    position: absolute; /* 绝对定位 */
    right: 20px;
    .left,
    .right {
      display: flex;
      align-items: center;
      margin-left: 10px;
      font-size: 10px;
    }
    .img {
      width: 30rpx;
      height: 20rpx;
    }
  }
}
.text-ellipsis {
  overflow: hidden; /* 确保内容超出容器时会被隐藏 */
  display: -webkit-box; /* 使用弹性盒子布局模型 */
  -webkit-line-clamp: 2; /* 限制在两行 */
  -webkit-box-orient: vertical; /* 垂直排列盒子 */
  text-overflow: ellipsis; /* 多余文本用省略号表示 */
  white-space: normal; /* 使用正常的白空格处理方式，允许换行 */
}
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
