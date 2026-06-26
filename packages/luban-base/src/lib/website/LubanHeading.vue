<script setup lang="ts">
withDefaults(
  defineProps<{ level?: 1 | 2 | 3 | 4 | 5 | 6; content?: string }>(),
  { level: 2, content: '' },
);
</script>

<template>
  <component
    :is="`h${level}`"
    class="lb-heading"
  >
    {{ content }}
  </component>
</template>

<style scoped>
.lb-heading {
  margin: 0 0 8px;
  color: #1a1a1a;
  line-height: 1.3;
}
.lb-heading.lh-h1,
[class*='h1'] {
  font-size: 32px;
}
h1 {
  font-size: 32px;
}
h2 {
  font-size: 26px;
}
h3 {
  font-size: 22px;
}
h4 {
  font-size: 18px;
}
h5 {
  font-size: 16px;
}
h6 {
  font-size: 14px;
}
</style>
