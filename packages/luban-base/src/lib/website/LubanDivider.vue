<script setup lang="ts">
defineProps<{ variant?: 'solid' | 'dashed' | 'dotted' }>();
</script>

<template>
  <hr class="lb-divider" :style="{ borderStyle: variant || 'solid' }" />
</template>

<style scoped>
.lb-divider { width: 100%; border: none; border-top: 1px solid #e0e0e0; margin: 16px 0; }
</style>
