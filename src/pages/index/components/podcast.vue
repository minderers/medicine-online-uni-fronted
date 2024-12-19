<template>
  <div class="container">
    <div class="img-container">
      <img
        src="../../../static/index/bg_audio.png"
        class="cover"
        :style="{ transform: `rotate(${rotationAngle}deg)` }"
      />

      <img
        :src="props.cover"
        class="inside"
        :style="{ transform: `rotate(${rotationAngle}deg)` }"
      />
    </div>

    <div class="audio-player">
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
        {{ formatTime(currentTime) }} / {{ formatTime(dura) }}
      </div>
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
  cover: String,
});

// 音频播放相关的状态
const isPlaying = ref(false); // 默认是暂停状态
const currentTime = ref(0); // 当前播放时间
const dura = ref(props.currentAudioDuration); // 音频总时长
let audioContext = null;

const progressPercentage = computed(() =>
  dura.value > 0 ? (currentTime.value / dura.value) * 100 : 0
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

let animationIntervalId = null; // 动画的定时器 ID
const rotationAngle = ref(0); // 当前的旋转角度

const startAnimation = () => {
  animationIntervalId = setInterval(() => {
    rotationAngle.value += 1.2; // 每秒旋转 72 度，控制速度
    if (rotationAngle.value >= 360) {
      rotationAngle.value -= 360; // 确保角度在 0-360 度内
    }
  }, 16); // 大约 60 FPS
};

const stopAnimation = () => {
  clearInterval(animationIntervalId);
  animationIntervalId = null;
};

const togglePlay = () => {
  if (isPlaying.value) {
    audioContext.pause();
    stopAnimation();
  } else {
    audioContext.src = props.currentAudioUrl;
    audioContext.play();
    startAnimation(); // 启动动画
  }
  isPlaying.value = !isPlaying.value; // 切换播放状态
};

const formatTime = (time) => {
  const hours = Math.floor(time / 3600) // 计算小时
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60) // 剩余时间计算分钟
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60) // 剩余时间计算秒数
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

watch(
  () => props.currentAudioDuration,
  (newDuration) => {
    dura.value = newDuration;
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
    audioContext.destroy();
  }
  if (animationIntervalId) {
    clearInterval(animationIntervalId);
  }
});
</script>

<style scoped>
.container {
  background-color: #dbd5d5;
  display: flex;
  flex-direction: column; /* 垂直排列 */
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
}

.audio-player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx;
  border-radius: 10rpx;
  margin-bottom: 10rpx;
}

.play-button {
  width: 60rpx;
  height: 60rpx;
  cursor: pointer;
  margin-right: 40rpx;
}

.progress-container {
  flex: 1;
  display: flex;
  justify-content: center;
  margin-left: 10rpx;
}

.progress-bar {
  position: relative;
  width: 400rpx;
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
  margin-left: 40rpx;
}

.cover {
  margin-top: 10rpx;
  width: 400rpx;
  height: 400rpx;
}

.inside {
  position: absolute;
  top: 290rpx;
  left: 240rpx;
  justify-content: space-between;
  width: 280rpx;
  height: 280rpx;
  border-radius: 50%;
}

.rotating {
  animation: rotate 5s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.pause {
  animation-play-state: paused;
}
</style>
