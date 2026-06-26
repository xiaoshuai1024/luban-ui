<script setup lang="ts">
withDefaults(
  defineProps<{
    content?: string;
    fontSize?: number;
    color?: string;
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
  }>(),
  { content: '', fontSize: 32, color: '#333', align: 'left', bold: false },
);
</script>

<template>
  <p
    class="lb-poster-text"
    :style="{
      fontSize: `${fontSize}px`,
      color,
      textAlign: align,
      fontWeight: bold ? 700 : 400,
    }"
  >
    {{ content }}
  </p>
</template>

<style scoped>
.lb-poster-text {
  margin: 0;
  padding: 8px 16px;
  word-break: break-word;
}
</style>
