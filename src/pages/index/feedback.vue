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
          class="input1 my-2 h-20"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Back from "@/components/back.vue";
</script>

<style lang="scss" scoped>
.input1 {
  border: 1px solid gray;
}
</style>
