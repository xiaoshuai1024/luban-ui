<script setup lang="ts">
defineProps<{ html: string }>();
</script>

<template>
  <div
    class="lb-richtext"
    v-html="html"
  />
</template>

<style scoped>
.lb-richtext {
  line-height: 1.7;
  color: #333;
  word-break: break-word;
}
.lb-richtext :deep(p) {
  margin: 0 0 8px;
}
.lb-richtext :deep(ul),
.lb-richtext :deep(ol) {
  padding-left: 20px;
  margin: 0 0 8px;
}
.lb-richtext :deep(img) {
  max-width: 100%;
}
</style>
