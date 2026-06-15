<script setup lang="ts">
defineProps<{ src: string; poster?: string; controls?: boolean; width?: number | string }>();
</script>

<template>
  <video class="lb-video" :src="src" :poster="poster" :controls="controls !== false" :style="{ width: width == null ? '100%' : typeof width === 'number' ? `${width}px` : width }" />
</template>

<style scoped>
.lb-video { max-width: 100%; border-radius: 4px; display: block; }
</style>
