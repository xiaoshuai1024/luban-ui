<script setup lang="ts">
defineProps<{ href: string; text: string; target?: string }>();
</script>

<template>
  <a class="lb-link" :href="href" :target="target || '_self'">{{ text }}</a>
</template>

<style scoped>
.lb-link { color: #1976d2; text-decoration: none; }
.lb-link:hover { text-decoration: underline; }
</style>
