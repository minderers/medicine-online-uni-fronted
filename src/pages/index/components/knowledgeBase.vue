<template>
  <view>
    <!-- 父节点导航 -->
    <view class="tag-container flex">
      <view
        v-for="(item, index) in tabBars"
        :key="item.pkId"
        :class="navIndex === index ? 'text-white' : 'normal'"
        class="item m-2 px-2 py-1"
        @click="changeTab(index)"
      >
        {{ item.title }}
      </view>
    </view>

    <scroll-view scroll-y>
      <view v-for="(item, index) in tabBars" :key="item.pkId">
        <view v-if="navIndex === index">
          <view
            v-if="item.children && item.children.length > 0"
            class="left bc-grey"
          >
            <view
              v-for="(child, childIndex) in item.children"
              :key="child.pkId"
              class="bc-grey"
            >
              <!-- 子节点标题 -->
              <view
                @click="toggleChildVisibility(item, childIndex)"
                :class="child.selected ? 'selected' : 'tab-item'"
              >
                {{ child.title }}
              </view>

              <view v-if="child.selected && child.type == 0" class="box">
                <view class="book-list">
                  <view
                    v-for="(book, index) in bookList"
                    :key="index"
                    @click="toBook(book)"
                  >
                    <Book class="book-container">
                      <image
                        slot="cover"
                        :src="book.cover"
                        class="book-image"
                      />

                      <view slot="title">{{ book.title }}</view>
                      <view slot="browseNum">{{ book.browseNum }}</view>
                    </Book>
                  </view>
                </view>
              </view>
              <!-- 展开时显示子节点的子级 -->
              <view
                v-if="
                  child.expanded && child.children && child.children.length > 0
                "
              >
                <view
                  v-for="(subChild, subChildIndex) in child.children"
                  :key="subChild.pkId"
                  :class="subChild.selected ? 'bc-green' : 'bc-white'"
                  @click="toggleSubChildSelection(child, subChild)"
                >
                  <view
                    :class="
                      subChild.selected ? 'item-selected' : 'item-noSelected'
                    "
                  >
                    {{ subChild.title }}
                  </view>
                </view>
              </view>

              <view v-if="child.selected && child.type == 1" class="box">
                <view
                  v-if="
                    child.expanded &&
                    child.children &&
                    child.children.length > 0
                  "
                >
                  <view
                    v-for="(video, index) in videoList"
                    class="video-container"
                    @click="toDetail(video)"
                  >
                    <Video>
                      <image slot="cover" :src="video.cover" class="video" />
                      <view slot="title">{{ video.title }}</view>
                      <view slot="label">{{ video.label }}</view>
                    </Video>
                  </view>
                </view>
                <view v-else class="font-grey">
                  {{ videoList.length > 0 ? "" : "暂无视频" }}
                </view>
              </view>

              <view v-if="child.selected && child.type == 2" class="box">
                <view
                  v-for="(podcast, index) in podcastList"
                  :key="podcast.pkId"
                >
                  <view @click="toPodcast(podcast)">
                    <Video v-if="podcast.cover" class="video-container">
                      <image slot="cover" :src="podcast.cover" class="video" />
                      <view slot="title">{{ podcast.title }}</view>
                      <view slot="label">{{ podcast.label }}</view>
                    </Video>
                    <view class="podcast" v-else>
                      <view>{{ podcast.title }}</view>
                      <view class="label">
                        <span
                          class="label-text"
                          :style="getRandomColor(podcast.pkId)"
                          >{{ podcast.label }}</span
                        >
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  getResourceCategory,
  getBookList,
  getVideoList,
  getPodcastList,
} from "@/service/resource";
import Book from "./book.vue";
import Video from "./video.vue";
const navIndex = ref(0);
const tabBars = ref([]);

// 获取父节点列表及子节点
const getTabList = async () => {
  try {
    const res = await getResourceCategory(0);
    if (res.code === 0 && Array.isArray(res.data)) {
      tabBars.value = res.data;

      // 默认选中第一个父节点下的第一个子节点
      if (tabBars.value.length > 0 && tabBars.value[0].children.length > 0) {
        tabBars.value[0].children[0].selected = true;
        tabBars.value[0].children[0].expanded = true;
      }
    }
  } catch (error) {
    console.error("获取分类失败", error);
  }
};

// 切换父节点时加载子节点
const changeTab = async (index) => {
  navIndex.value = index;

  // 展开当前选中父节点的第一个子节点
  const parent = tabBars.value[index];
  if (parent.children && parent.children.length > 0) {
    parent.children.forEach((child, i) => {
      child.expanded = i === 0; // 展开第一个子节点
      child.selected = i === 0; // 选中第一个子节点
    });
  }
};

// 切换子节点展开状态
const toggleChildVisibility = async (parent, index) => {
  const child = parent.children[index];
  categoryName.value = child.title;
  podcastCategoryId.value = child.pkId;
  if (child.children && child.children.length > 0) {
    videoCategoryId.value = child.children[0].pkId;
  } else if (child.children.length < 0) {
    videoCategoryId.value = child.pkId;
  }

  // 如果当前子节点已展开，则收起它
  if (child.expanded) {
    child.expanded = false; // 收起当前子节点
    child.selected = true;
  } else {
    // 如果当前子节点未展开，则收起所有同级子节点
    parent.children.forEach((sibling) => {
      sibling.expanded = false;
      sibling.selected = false;
    });

    // 展开当前子节点
    child.expanded = true;
    child.selected = true;

    // 如果当前子节点没有加载过子级数据，加载子节点
    if (!child.children) {
      try {
        const res = await getResourceCategory(child.pkId);
        child.children = res.data || [];
      } catch (error) {
        console.error("获取子节点失败", error);
      }
    }

    // 自动选中当前展开节点的第一个子节点
    if (child.children && child.children.length > 0) {
      child.children.forEach((subChild, subIndex) => {
        subChild.selected = subIndex === 0; // 默认选中第一个子节点
      });
    }
  }

  fetchBookList();
  fetchVideoList();
  fetchPodcastList();
};
const toggleSubChildSelection = (parent, subChild) => {
  // 清除当前父节点下所有子节点的子级选中状态
  parent.children.forEach((child) => {
    if (child) {
      child.selected = false;
    }
  });

  // 设置当前点击的子节点的子级为选中状态
  subChild.selected = true;
  videoCategoryId.value = subChild.pkId;

  if (videoCategoryId.value) {
    fetchVideoList(); // 确保异步操作完成
  }
};

const bookList = ref([]);
const categoryName = ref("中医理论基础"); // 设置默认值

const fetchBookList = async () => {
  try {
    const response = await getBookList(categoryName.value); // 使用 categoryName.value
    bookList.value = response.data || [];
  } catch (error) {
    console.error("获取书籍列表失败", error);
  }
};

const videoList = ref([]);
const videoCategoryId = ref(0);
const fetchVideoList = async () => {
  try {
    const response = await getVideoList(videoCategoryId.value);
    videoList.value = response.data || [];
  } catch (error) {
    console.error("获取视频列表失败", error);
  }
};

const podcastList = ref([]);
const podcastCategoryId = ref(33);
const fetchPodcastList = async () => {
  try {
    const response = await getPodcastList(podcastCategoryId.value);
    podcastList.value = response.data || [];
  } catch (error) {
    console.error("获取音频列表失败", error);
  }
};

const getRandomColor = (index) => {
  const colors = ["red", "blue", "green", "orange", "purple"];
  const color = colors[index % colors.length]; // 使用索引来确保每个标签颜色不同
  return {
    borderColor: color,
    color: color,
    borderWidth: "1px",
    borderStyle: "solid",
  };
};

const toDetail = (item) => {
  const query = `title=${encodeURIComponent(
    item.title
  )}&browseNum=${encodeURIComponent(
    item.browseNum
  )}&starNum=${encodeURIComponent(item.starNum)}&pkId=${encodeURIComponent(
    item.pkId
  )}`;
  uni.navigateTo({
    url: `/pages/index/ResourceDetail?${query}`,
  });
};

const toBook = (item) => {
  const query = `title=${encodeURIComponent(
    item.title
  )}&url=${encodeURIComponent(item.url)}`;
  uni.navigateTo({
    url: `/pages/index/bookDetail?${query}`,
  });
};

const toPodcast = (item) => {
  const query = `title=${encodeURIComponent(
    item.title
  )}&browseNum=${encodeURIComponent(
    item.browseNum
  )}&starNum=${encodeURIComponent(item.starNum)}&pkId=${encodeURIComponent(
    item.pkId
  )}`;
  uni.navigateTo({
    url: `/pages/index/podcastDetail?${query}`,
  });
};

onMounted(() => {
  getTabList();
  fetchBookList(categoryName);
  fetchVideoList(videoCategoryId);
  fetchPodcastList(podcastCategoryId);
});
</script>

<style>
.item {
  background: #32b880;
  border-radius: 10rpx;
}

.normal {
  background-color: #fff;
  color: #32b880;
  border: #32b880 1rpx solid;
}

.left {
  height: 1500rpx;
  width: 250rpx;
  font-size: 30rpx;
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

.item-selected {
  border-left: #fff 10rpx solid;
  color: #fff;
  width: 200rpx;
  padding: 15rpx;
  margin-left: 20rpx;
}

.item-noSelected {
  width: 200rpx;
  padding: 15rpx;
  margin-left: 20rpx;
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

.book-image {
  width: 150rpx;
  height: 200rpx;
}

.book-list {
  display: flex;
  flex-wrap: wrap; /* 使子元素换行 */
  justify-content: space-between; /* 使子元素间隔均匀 */
  gap: 10rpx; /* 子元素间的间距 */
  padding: 10rpx;
}

.book-container {
  width: 150rpx; /* 每个 Book 组件占据三分之一宽度，减去间距 */
  margin-bottom: 20rpx; /* 底部间距 */
}

.box {
  position: absolute;
  left: 260rpx;
  top: 0rpx;
}

.video {
  width: 250rpx;
  height: 150rpx;
}

.video-container {
  width: 500rpx;
  height: 150rpx;
  margin-bottom: 20rpx;
}

.font-grey {
  color: grey;
}

.label {
  font-size: 22rpx;
  margin-top: 20rpx;
}

.label-text {
  padding: 2rpx 5rpx;
  border-radius: 10rpx;
}

.podcast {
  padding-bottom: 20rpx;
  padding-top: 20rpx;
  border-bottom: 1rpx solid #f2f2f2;
}
</style>
