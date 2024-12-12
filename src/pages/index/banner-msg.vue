<template>
  <Navbar />
  <button @click="back">返回</button>
  <div>banner-msg</div>
</template>

<script setup>
import Navbar from "@/components/navbar.vue";
import { ref } from "vue";
const back = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped></style>
