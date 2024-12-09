<template>
  <div class="mt-3">
    <div v-for="item in news.list" :key="item.pkId" class="mt-2">
      <div class="item mx-2 flex justify-between my-2">
        <div class="" v-if="item.cover">
          <image :src="item.cover" class="img w-30 h-20 cover mr-2" />
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
                  src="../../../static/index/icon_chakan.png"
                  mode="scaleToFill"
                  class="img"
                />
                <div class="text-gray-400 ml-2">{{ item.browseNum }}</div>
              </div>
              <div class="right">
                <image
                  src="../../../static/index/icon_shoucang.png"
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
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { getNewsList } from "@/service/news";
import { onReachBottom } from "@dcloudio/uni-app";

// 分⻚参数封装：当前⻚和每⻚条数
const pageParams = reactive({
  page: 1,
  limit: 10,
});

// 封装资讯数据：数组和总条数
const news = reactive({
  list: [],
  total: 0,
});

const finish = ref(false);
// 封装获取资讯列表的函数
const getAllNews = async () => {
  // 退出加载，弹出 toast
  if (finish.value === true) {
    return uni.showToast({ icon: "none", title: "没有更多数据~" });
  }
  // 使⽤分⻚参数调⽤接⼝
  const res = await getNewsList(pageParams);
  // 将请求到的数据追加到数组尾部
  news.list.push(...res.data.list);
  // 总条数更新
  news.total = res.data.total;
  // 如果还没到最后⼀⻚
  if (news.list.length < news.total) {
    // ⻚码累加
    pageParams.page++;
  } else {
    // 结束加载
    finish.value = true;
  }
};

// 组件挂载的时候加载数据
onMounted(() => getAllNews());
// ⻚⾯触底加载数据
onReachBottom(() => getAllNews());

// 定义一个计算属性来返回随机颜色
const getRandomColor = (index) => {
  const colors = ["red", "blue", "green", "orange", "purple"];
  const color = colors[index % colors.length]; // 使用索引来确保每个标签颜色不同
  return {
    borderColor: color,
    color: color, // 文字颜色和边框颜色相同
  };
};
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
