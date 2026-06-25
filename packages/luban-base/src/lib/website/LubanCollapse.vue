<script setup lang="ts">
import { ref } from 'vue';
interface Panel {
  title: string;
  content?: string;
}
const props = defineProps<{ panels: Panel[] }>();
const openSet = ref<Set<number>>(new Set([0]));
const toggle = (i: number) => {
  if (openSet.value.has(i)) openSet.value.delete(i);
  else openSet.value.add(i);
};
</script>

<template>
  <div class="lb-collapse">
    <div v-for="(panel, i) in props.panels" :key="i" class="lb-collapse__panel">
      <button class="lb-collapse__header" type="button" @click="toggle(i)">
        <span>{{ panel.title }}</span>
        <span class="lb-collapse__arrow">{{ openSet.has(i) ? '−' : '+' }}</span>
      </button>
      <div v-show="openSet.has(i)" class="lb-collapse__body">
        {{ panel.content }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.lb-collapse {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}
.lb-collapse__panel {
  border-bottom: 1px solid #eee;
}
.lb-collapse__panel:last-child {
  border-bottom: none;
}
.lb-collapse__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}
.lb-collapse__arrow {
  color: #999;
}
.lb-collapse__body {
  padding: 12px 16px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>
