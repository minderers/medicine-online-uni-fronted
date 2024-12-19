<template>
  <view class="m-2 bc-grey">
    <Noback><slot> 活动 </slot></Noback>
    <view
      v-for="(item, index) in activityList"
      :key="index"
      class="activity-item p-2"
    >
      <view v-if="item.tag == 1" @click="toDetail(item)">
        <image :src="item.cover" class="activity-image" />
        <view class="activity-title">
          <text class="label">投票活动</text>
          {{ item.title }}</view
        >
      </view>
      <view v-else>
        <image :src="item.cover" class="activity-image" />
        <view class="activity-title">
          <text class="label">问卷活动</text>
          {{ item.title }}</view
        >
      </view>
    </view>
  </view>
</template>

<script setup>
import Noback from "../../components/noback.vue";
import { onMounted, ref } from "vue";
import { getVoteActivityList } from "../../service/activity";

const activityList = ref([]);
const getActivityList = async () => {
  const res = await getVoteActivityList();
  activityList.value = res.data;
};

const toDetail = (item) => {
  const query = `title=${encodeURIComponent(
    item.title
  )}&cover=${encodeURIComponent(item.cover)}&pkId=${encodeURIComponent(
    item.pkId
  )}`;
  uni.navigateTo({
    url: `/pages/activity/activityDetail?${query}`,
  });
};
onMounted(() => {
  getActivityList();
});
</script>

<style scoped>
.center {
  text-align: center;
}

.activity-item {
  background-color: #fff;
}

.activity-image {
  width: 100%;
  height: 180rpx;
  object-fit: cover;
  border-radius: 10rpx;
}

.activity-title {
  font-size: 34rpx;
  color: #333;
  margin-top: 10rpx;
}

.label {
  padding: 5rpx;
  border-radius: 8rpx;
  border: 4rpx solid orange;
  font-size: 28rpx;
  color: orange;
}
</style>
