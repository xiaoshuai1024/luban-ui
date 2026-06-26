<script setup lang="ts">
defineProps<{ items: string[]; ordered?: boolean }>();
</script>

<template>
  <component
    :is="ordered ? 'ol' : 'ul'"
    class="lb-list"
  >
    <li
      v-for="(item, i) in items"
      :key="i"
      class="lb-list__item"
    >
      {{ item }}
    </li>
  </component>
</template>

<style scoped>
.lb-list {
  margin: 0;
  padding-left: 20px;
}
.lb-list__item {
  line-height: 1.8;
  color: #333;
}
</style>
