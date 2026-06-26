<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const props = withDefaults(defineProps<{
  fallbackText?: string;
}>(), {
  fallbackText: '组件渲染失败',
});

const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((err) => {
  hasError.value = true;
  errorMessage.value = (err as Error).message;
  // 返回 false 阻止错误继续向上传播，防止单个物料崩溃导致整页空白
  return false;
});
</script>

<template>
  <div v-if="hasError" class="luban-error-boundary" role="alert">
    <span class="luban-error-boundary__icon">⚠️</span>
    <span class="luban-error-boundary__text">{{ fallbackText }}</span>
  </div>
  <slot v-else />
</template>

<style scoped>
.luban-error-boundary {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #fef0f0;
  border: 1px dashed #f56c6c;
  border-radius: 4px;
  color: #f56c6c;
  font-size: 12px;
}
.luban-error-boundary__icon {
  font-size: 14px;
}
</style>
