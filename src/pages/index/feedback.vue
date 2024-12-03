<template>
  <div>
    <Back>
      <slot>详情</slot>
    </Back>
    <div class="body m-2">
      <div class="advice">
        您的问题或建议：
        <input
          type="text"
          placeholder="请简要描述你在使用产品过程中的问题和意见"
          class="input1 my-2"
        />
      </div>
      <div class="type">
        问题类型：
        <uni-popup :show="showPopupStatus" type="bottom" @change="change">
          <view class="popup-content">
            <view class="category-list">
              <view
                v-for="(item, index) in categories"
                :key="index"
                @click.stop="selectCategory(item)"
              >
                <text :class="{ selected: item.selected }">{{
                  item.name
                }}</text>
              </view>
            </view>
          </view>
        </uni-popup>
        <div @click="togglePopup">{{ selectedCategory || "请选择类别" }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import Back from "@/components/back.vue";
const showPopupStatus = ref(false);
const popup = ref(null);
const show = ref(false);
const change = (e) => {
  show.value = e.show;
};
const categories = ref([
  { name: "类别1", selected: false },
  { name: "类别2", selected: false },
  { name: "类别3", selected: false },
]);
const selectedCategory = ref("请选择类别"); // 存储选中的类别

const selectCategory = (item) => {
  categories.value.forEach((cat) => (cat.selected = false));
  item.selected = true;
  selectedCategory.value = item.name; // 更新选中的类别
  showPopupStatus.value = false; // 关闭弹窗
};
</script>

<style lang="scss" scoped>
.input1 {
  border: 1px solid gray;
  padding-top: 10px;
  padding-bottom: 20px;
}
.popup-content {
  padding: 20px;
}
.category-list {
  display: flex;
  flex-direction: column;
}
.category-list view {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
.selected {
  color: #007aff;
}
.type div {
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
