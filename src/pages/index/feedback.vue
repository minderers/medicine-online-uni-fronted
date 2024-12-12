<template>
  <div>
    <Back>
      <slot>意见反馈</slot>
    </Back>
    <div class="form m-2">
      <div class="advice">
        您的问题或建议：
        <input
          type="text"
          placeholder="请简要描述你在使用产品过程中的问题和意见"
          class="input1 my-2"
        />
      </div>
      <div class="">
        问题类型：
        <view class="container my-2">
          <!-- 触发弹出层的按钮 -->
          <div @click="showPopup = true" class="input2 px-2">
            {{ questionType }}
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
          src="../../static/index/take.png"
          mode="scaleToFill"
          class="h-30 w-30"
        />
      </div>
      <div class="">您的联系方式：</div>
      <div class="">
        <input
          type="text"
          class="input2 my-2 px-2"
          placeholder="请输入手机号"
        />
      </div>
    </div>
    <button class="text-white rounded-lg my-10 bg-green-500 w-50">提交</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Back from "@/components/back.vue";
const questionType = ref("请选择问题类型");
const showPopup = ref(false);
const list = ref([
  { name: "类别1", selected: false },
  { name: "类别2", selected: false },
  { name: "类别3", selected: false },
]);

const selectOption = (item) => {
  questionType.value = item.name;
  showPopup.value = false;
};

const closePopup = () => {
  showPopup.value = false;
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
</style>
