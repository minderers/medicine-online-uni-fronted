<template>
  <div class="audio-player">
    <!-- 播放/暂停按钮 -->
    <img
      :src="isPlaying ? pauseIcon : playIcon"
      alt="play/pause"
      class="play-button"
      @click="togglePlay"
    />

    <!-- 自定义进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <!-- 已播放部分 -->
        <div
          class="progress-played"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
        <!-- 圆点 -->
        <div
          class="progress-dot"
          :style="{ left: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- 文字进度显示 -->
    <div class="time-display">
      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";

// 传入的props
const props = defineProps({
  currentAudioUrl: String,
  currentAudioDuration: Number, // 传递音频总时长（秒）
  playIcon: String,
  pauseIcon: String,
});

// 音频播放相关的状态
const isPlaying = ref(false); // 默认是暂停状态
const currentTime = ref(0); // 当前播放时间
const duration = ref(props.currentAudioDuration); // 音频总时长
let audioContext = null;

const progressPercentage = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
);
const initAudio = () => {
  audioContext = wx.createInnerAudioContext();

  // 监听音频元数据加载完毕后，获取音频时长
  audioContext.onCanplay(() => {
    audioContext.src = props.currentAudioUrl;
    if (isPlaying.value) {
      audioContext.play(); // 如果是播放状态，自动播放
    }
  });

  // 播放时实时更新当前播放时间
  audioContext.onTimeUpdate(() => {
    currentTime.value = audioContext.currentTime;
  });

  // 播放结束后，设置为暂停状态
  audioContext.onEnded(() => {
    isPlaying.value = false;
  });
};

const togglePlay = () => {
  if (isPlaying.value) {
    audioContext.pause();
  } else {
    audioContext.src = props.currentAudioUrl;
    audioContext.play();
  }
  isPlaying.value = !isPlaying.value; // 切换播放状态
};

// 格式化时间为 mm:ss 格式
const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

watch(
  () => props.currentAudioDuration,
  (newDuration) => {
    duration.value = newDuration;
  }
);

watch(
  () => props.currentAudioUrl,
  (newUrl) => {
    if (audioContext) {
      audioContext.src = newUrl;
    }
  }
);

onMounted(() => {
  initAudio();
});

onUnmounted(() => {
  if (audioContext) {
    audioContext.destory();
  }
});
</script>

<style scoped>
.audio-player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #dbd5d5;
  padding: 10rpx;
  border-radius: 10rpx;
}

.play-button {
  width: 60rpx;
  height: 60rpx;
  cursor: pointer;
}

.progress-container {
  flex: 1;
  display: flex;
  justify-content: center;
  margin-left: 10rpx;
}

.progress-bar {
  position: relative;
  width: 70%;
  height: 4rpx;
  background: #fff;
  border-radius: 2rpx;
}

.progress-played {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #32b880;
  border-radius: 2rpx;
}

.progress-dot {
  position: absolute;
  top: -15rpx;
  width: 30rpx;
  height: 30rpx;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 5rpx rgba(0, 0, 0, 0.2);
}

.time-display {
  font-size: 20rpx;
  color: #555;
  text-align: right;
}
</style>
