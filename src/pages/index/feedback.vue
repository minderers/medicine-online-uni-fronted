<template>
  <Back>
    <slot>意见反馈</slot>
  </Back>
  <div class="form m-2">
    <div class="advice">
      您的问题或建议：
      <input
        type="text"
        v-model="feedback.content"
        placeholder="请简要描述你在使用产品过程中的问题和意见"
        class="input1 my-2"
      />
    </div>
    <div class="">
      问题类型：
      <view class="container my-2">
        <!-- 触发弹出层的按钮 -->
        <div @click="showPopup = true" class="input2 px-2">
          {{ feedback.typeName }}
        </div>

        <!-- 遮罩层 -->
        <view v-if="showPopup" class="mask" @click="closePopup"></view>

        <!-- 底部弹出层 -->
        <view v-if="showPopup" class="popup">
          <view class="popup-content">
            <!-- 弹出层内容 -->
            <div
              class="type py-3 text-center"
              v-for="(item, index) in list"
              :key="index"
              @click="selectOption(item)"
            >
              {{ item.name }}
            </div>
            <button @click="closePopup">关闭</button>
          </view>
        </view>
      </view>
    </div>
    <div class="">问题图片：</div>
    <div class="m-3">
      <image
        v-if="image"
        :src="image"
        mode="scaleToFill"
        class="h-30 w-30 mr-2 mb-2"
      />
      <button v-if="!image" @click="handleUploadImage" class="upload-button">
        <image
          src="../../static/index/take.png"
          mode="scaleToFill"
          class="h-30 w-30"
        />
      </button>
      <button v-if="image" @click="removeImage" class="delete-button">
        删除图片
      </button>
    </div>
    <div class="">您的联系方式：</div>
    <div class="">
      <input
        type="text"
        v-model="feedback.contact"
        class="input2 my-2 px-2"
        placeholder="请输入手机号"
      />
    </div>
  </div>
  <button
    class="text-white rounded-lg my-10 bg-green-500 w-50"
    @click="submitForm"
  >
    提交
  </button>
</template>

<script setup>
import { ref } from "vue";
import Back from "@/components/back.vue";
import { submitFeedback, uploadImage } from "@/service/feedback";

const feedback = ref({
  content: "",
  type: null, // 使用整数类型存储问题类型ID
  typeName: "请选择问题类型",
  contact: "",
});

const showPopup = ref(false);
const list = ref([
  { id: 0, name: "类别1" },
  { id: 1, name: "类别2" },
  { id: 2, name: "类别3" },
  { id: 3, name: "类别4" }, // 假设有四个类别
]);

const image = ref(null);
const imgUrl = ref("");

const selectOption = (item) => {
  feedback.value.type = item.id; // 存储问题类型的ID
  feedback.value.typeName = item.name; // 显示问题类型的名称
  showPopup.value = false;
};

const closePopup = () => {
  showPopup.value = false;
};

const handleUploadImage = () => {
  if (image.value) {
    uni.showToast({
      title: "最多上传1张！",
      icon: "none",
    });
    return;
  }

  uni.chooseImage({
    count: 1, // 只能选择一张图片
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success: async (res) => {
      const filePath = res.tempFilePaths[0];
      try {
        const ossUrl = await uploadImage(filePath);
        image.value = filePath;
        imgUrl.value = ossUrl;
      } catch (error) {
        console.error("图片上传失败", error);
        uni.showToast({
          title: "图片上传失败",
          icon: "none",
        });
      }
    },
    fail: (err) => {
      console.error("Failed to choose image", err);
    },
  });
};

const removeImage = () => {
  image.value = null;
  imgUrl.value = "";
};

const submitForm = async () => {
  if (feedback.value.type === null) {
    uni.showToast({
      title: "请选择问题类型",
      icon: "none",
    });
    return;
  }

  try {
    const response = await submitFeedback(
      {
        content: feedback.value.content,
        type: feedback.value.type, // 传递问题类型的ID
        contact: feedback.value.contact,
      },
      [imgUrl.value]
    );
    if (response.code === 0) {
      console.log("反馈提交成功");
      // 清空表单
      feedback.value.content = "";
      feedback.value.type = null;
      feedback.value.typeName = "请选择问题类型";
      feedback.value.contact = "";
      image.value = null;
      imgUrl.value = "";
      uni.showToast({
        title: "提交成功",
        icon: "success",
      });
    } else {
      console.error("反馈提交失败", response.message);
      uni.showToast({
        title: "提交失败",
        icon: "none",
      });
    }
  } catch (error) {
    console.error("Error submitting feedback", error);
    uni.showToast({
      title: "提交出错",
      icon: "none",
    });
  }
};
</script>

<style lang="scss" scoped>
.input1 {
  border: 1px solid gray;
  padding-top: 10rpx;
  padding-bottom: 200rpx;
}
.container {
  position: relative;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 遮罩层样式，半透明黑色 */
  z-index: 999; /* 确保遮罩层在弹出层下方 */
}

.popup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 1000; /* 弹出层的 z-index 应该比遮罩层大 */
  /* 弹出层样式 */
}

.popup-content {
  padding: 30px;
  /* 内容区域样式 */
}

.type {
  border-bottom: solid 1px gray;
}
.input2 {
  border: 1px solid gray;
  padding-top: 10px;
  padding-bottom: 10px;
}
.upload-button {
  background-color: transparent;
  border: none;
  padding: 0;
  outline: none;
}
.delete-button {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  outline: none;
  border-radius: 5px;
}
</style>
