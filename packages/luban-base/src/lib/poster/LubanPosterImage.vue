<script setup lang="ts">
defineProps<{ src: string; width?: number; radius?: number }>();
</script>

<template>
  <img
    class="lb-poster-image"
    :src="src"
    :style="{
      width: width ? `${width}px` : '100%',
      borderRadius: radius ? `${radius}px` : 0,
    }"
  >
</template>

<style scoped>
.lb-poster-image {
  display: block;
  margin: 8px auto;
  object-fit: contain;
}
</style>
