<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
  defineProps<{
    deadline: string;
    label?: string;
  }>(),
  { label: '距离结束' },
);

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;

const remaining = computed(() => {
  const target = new Date(props.deadline).getTime();
  const diff = Math.max(0, target - now.value);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, ended: diff === 0 };
});

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="lb-countdown">
    <span v-if="label" class="lb-countdown__label">{{ label }}</span>
    <div v-if="!remaining.ended" class="lb-countdown__digits">
      <span class="lb-countdown__unit"
        >{{ remaining.days }}<small>天</small></span
      >
      <span class="lb-countdown__sep">:</span>
      <span class="lb-countdown__unit"
        >{{ String(remaining.hours).padStart(2, '0') }}<small>时</small></span
      >
      <span class="lb-countdown__sep">:</span>
      <span class="lb-countdown__unit"
        >{{ String(remaining.minutes).padStart(2, '0') }}<small>分</small></span
      >
      <span class="lb-countdown__sep">:</span>
      <span class="lb-countdown__unit"
        >{{ String(remaining.seconds).padStart(2, '0') }}<small>秒</small></span
      >
    </div>
    <div v-else class="lb-countdown__ended">活动已结束</div>
  </div>
</template>

<style scoped lang="scss">
.lb-countdown {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff3e0;
  border-radius: 6px;
  color: #e65100;
  font-weight: 600;
}
.lb-countdown__label {
  font-size: 14px;
}
.lb-countdown__digits {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
}
.lb-countdown__unit {
  background: #e65100;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 16px;
  min-width: 28px;
  text-align: center;
  small {
    font-size: 10px;
    margin-left: 1px;
  }
}
.lb-countdown__sep {
  color: #e65100;
}
.lb-countdown__ended {
  font-size: 14px;
}
</style>
