<script setup lang="ts">
import { computed } from 'vue';
const props = withDefaults(defineProps<{ value: string; size?: number }>(), {
  size: 160,
});
// 使用公开 QR 码 API 渲染（无外部依赖；离线/自托管可替换为本地生成）
const src = computed(
  () =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${props.size}x${props.size}&data=${encodeURIComponent(props.value)}`,
);
</script>

<template>
  <div class="lb-qrcode">
    <img
      :src="src"
      :width="size"
      :height="size"
      alt="二维码"
    >
  </div>
</template>

<style scoped>
.lb-qrcode {
  display: inline-block;
  padding: 8px;
}
</style>
