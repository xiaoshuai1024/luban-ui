<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'rect' | 'circle';
    color?: string;
    width?: number;
    height?: number;
    radius?: number;
  }>(),
  { type: 'rect', color: '#1976d2', width: 200, height: 200, radius: 0 },
);
</script>

<template>
  <div
    class="lb-shape"
    :style="{
      width: `${width}px`,
      height: `${height}px`,
      background: color,
      borderRadius: type === 'circle' ? '50%' : `${radius}px`,
    }"
  />
</template>

<style scoped>
.lb-shape {
  margin: 8px;
}
</style>
