<template>
  <Back>
    <slot>活动详情</slot>
  </Back>
  <view class="m-3">
    <view class="mb-3">
      <image :src="props.cover" class="cover" />
      <view class="title mt-3">{{ props.title }}</view>
    </view>

    <view v-for="(item, index) in infoList" :key="index" class="p-3 grey"
      ><view class="container p-3" @click="select(index, item)">
        <image
          v-if="index == 0"
          class="rank"
          src="../../static/activity/rank.png"
        />
        <image :src="item.cover" class="avatar" v-if="item.cover" />
        <view>
          <view class="name">
            {{ item.name }}
          </view>
          <view class="font-grey">
            {{ item.intro }}
          </view>
          <view class="font-grey">
            <text>票数：{{ item.num }}</text>
            <text class="ml-1">占比：{{ item.proportion * 100 }}%</text>
          </view>
        </view>
        <image
          src="../../static/activity/selected.png"
          class="select"
          v-if="selectedIndex === index"
        />
      </view>
    </view>

    <view @click="submit" class="button" :style="buttonStyle">{{
      buttonText
    }}</view>
    <view class="foot"></view>
  </view>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Back from "@/components/back.vue";
import { getVoteInfoList, checkIsVote, addVote } from "../../service/activity";

const props = defineProps({
  pkId: Number,
  title: String,
  cover: String,
});

const infoList = ref([]);
const getInfoList = async () => {
  const res = await getVoteInfoList(props.pkId);
  infoList.value = res.data;
};

const isVote = ref();
const buttonText = ref("");
const buttonStyle = ref("");
const checkVoted = async () => {
  const res = await checkIsVote(props.pkId);
  isVote.value = res.data;
  console.log("value", isVote.value);
  if (isVote.value) {
    buttonText.value = "提交";
    buttonStyle.value = { backgroundColor: "#1aad19" };
  } else {
    buttonText.value = "已提交"; // 修改按钮文字
    buttonStyle.value = { backgroundColor: "#b4e19e" };
  }
};

const voteString = ref();
const vote = async () => {
  const res = await addVote(props.pkId, selectedItem.value.pkId);
  voteString.value = res.data;
};

const selectedIndex = ref();
const selectedItem = ref();
const select = (index, item) => {
  selectedIndex.value = index;
  selectedItem.value = item;
};

const submit = async () => {
  if (!isVote.value) {
    uni.showToast({
      title: "已投票!",
      icon: "none",
    });
  } else {
    await vote();
    uni.showToast({
      title: "投票成功",
      icon: "success",
    });
    getInfoList();
    checkVoted();
  }
};

onMounted(() => {
  getInfoList();
  checkVoted();
});
</script>

<style scoped>
.title {
  font-size: 35rpx;
}

.cover {
  width: 100%;
  height: 350rpx;
}

.grey {
  background-color: #f2f2f2;
}

.container {
  background-color: #fff;
  display: flex;
  width: 92%;
  flex-direction: row;
  align-items: center;
  border-radius: 10rpx;
  position: relative;
}

.avatar {
  width: 150rpx;
  height: 150rpx;
  margin-right: 10rpx;
}

.rank {
  width: 75rpx;
  height: 75rpx;
  align-items: center;

  margin-right: 10rpx;
}

.name {
  font-weight: bold;
}

.font-grey {
  color: grey;
}

.button {
  margin-top: 30rpx;
  margin-bottom: 50rpx;
  color: white;
  font-size: 36rpx;
  text-align: center;
  line-height: 100rpx;
  border-radius: 10rpx;
  background-color: #1aad19;
}

.foot {
  height: 50rpx;
}

.select {
  position: absolute;
  right: 30rpx;
  width: 50rpx;
  height: 50rpx;
}
</style>
