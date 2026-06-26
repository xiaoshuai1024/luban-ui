<script setup lang="ts">
import { ref } from 'vue';
interface Tab {
  label: string;
  content?: string;
}
const props = defineProps<{ tabs: Tab[] }>();
const active = ref(0);
</script>

<template>
  <div class="lb-tabs">
    <div class="lb-tabs__nav">
      <button
        v-for="(tab, i) in props.tabs"
        :key="i"
        type="button"
        :class="['lb-tabs__tab', { 'lb-tabs__tab--active': i === active }]"
        @click="active = i"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="lb-tabs__panel">
      <slot
        name="tab"
        :index="active"
        :tab="props.tabs[active]"
      >
        {{ props.tabs[active]?.content }}
      </slot>
    </div>
  </div>
</template>

<style scoped>
.lb-tabs {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}
.lb-tabs__nav {
  display: flex;
  border-bottom: 1px solid #eee;
  background: #fafafa;
}
.lb-tabs__tab {
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}
.lb-tabs__tab--active {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  font-weight: 600;
}
.lb-tabs__panel {
  padding: 16px;
}
</style>
