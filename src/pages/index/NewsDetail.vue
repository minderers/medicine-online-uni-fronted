<template>
  <Back>
    <slot>详情</slot>
  </Back>
  <rich-text :nodes="HTMLcontent"></rich-text>
  <div class="star" @click="addCollections">
    <div class="icon">
      <image
        :src="
          isStarred
            ? '../../static/index/icon_selectedshoucang.png'
            : '../../static/index/icon_shoucang.png'
        "
        mode="scaleToFill"
      />
    </div>
    收藏
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import Back from "../../components/back.vue";
import { getNewsDetail } from "@/service/news";
import { addCollection, deleteCollection } from "@/service/star";

const props = defineProps({
  pkId: Number,
});

// 使用 ref 创建响应式数据对象
const HTMLcontent = ref("");
const content = ref([]);

// 获取详情内容并处理
const getDetail = async () => {
  const res = await getNewsDetail(props.pkId);
  console.log(res);
  const contentWithHandledSpaces = res.data.content.replace(
    /　/g,
    '<span data-text="　"></span>'
  );
  HTMLcontent.value = contentWithHandledSpaces;
};

onMounted(() => {
  getDetail();
  console.log("组件挂载，pkId:", props.pkId);
});

const isStarred = ref(false);
const addCollections = async () => {
  try {
    if (!props.pkId) {
      console.error("pkId is missing:", props.pkId);
      uni.showToast({
        title: "参数错误",
        icon: "error",
      });
      return;
    }

    console.log("调用收藏接口，参数：", {
      contentId: props.pkId,
      type: "article",
      currentStatus: isStarred.value,
    });

    const res = isStarred.value
      ? await deleteCollection(props.pkId, "article")
      : await addCollection(props.pkId, "article");

    console.log("收藏接口返回：", res);

    if (res.code === 0) {
      isStarred.value = !isStarred.value;
      uni.showToast({
        title: isStarred.value ? "收藏成功" : "取消收藏",
        icon: "success",
      });
    } else {
      uni.showToast({
        title: res.msg || "操作失败",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("收藏操作失败:", error);
    uni.showToast({
      title: error.message || "操作失败",
      icon: "error",
    });
  }
};
</script>

<style scoped>
.star {
  background: #32b880;
  border-radius: 50%;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 40rpx 30rpx;
  color: white;
}
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
  image {
    width: 40rpx;
    height: 30rpx;
  }
}
</style>
