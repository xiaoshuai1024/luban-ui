<script setup lang="ts">
// 海报容器：固定宽度（导出图片尺寸），内容流式布局（plan §0.4 决策）
defineProps<{ width?: number; height?: number; background?: string }>();
</script>

<template>
  <div
    class="lb-poster"
    :style="{
      width: width ? `${width}px` : '1080px',
      minHeight: height ? `${height}px` : '1920px',
      background: background || '#fff',
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.lb-poster {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
