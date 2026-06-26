<script setup lang="ts">
defineProps<{ name: string; size?: number; color?: string }>();
</script>

<template>
  <span
    class="lb-icon"
    :style="{ fontSize: size ? `${size}px` : undefined, color }"
  >{{ name }}</span>
</template>

<style scoped>
.lb-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
