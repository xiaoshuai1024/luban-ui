<script setup lang="ts">
/**
 * 标签页可视化编辑器（T-ui-d18）：Tab 列表增删改 + 拖拽排序。
 * modelValue 为 TabItem[]（label + key + 可选 content）。
 */
import { computed } from 'vue';

export interface TabItem {
  id?: string;
  label: string;
  key?: string;
  content?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: TabItem[];
  }>(),
  { modelValue: () => [] }
);

const emit = defineEmits<{
  'update:modelValue': [value: TabItem[]];
}>();

const tabs = computed<TabItem[]>(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : [];
});

let _seq = 0;
function genId(): string {
  _seq++;
  return `tab-${Date.now().toString(36)}-${_seq}`;
}

function emitList(list: TabItem[]): void {
  emit('update:modelValue', list.map((t) => ({ ...t })));
}

function add(): void {
  const n = tabs.value.length + 1;
  emitList([...tabs.value, { id: genId(), label: `标签 ${n}`, key: `tab${n}` }]);
}

function remove(index: number): void {
  emitList(tabs.value.filter((_, i) => i !== index));
}

function update(index: number, patch: Partial<TabItem>): void {
  emitList(tabs.value.map((t, i) => (i === index ? { ...t, ...patch } : t)));
}

function move(index: number, dir: -1 | 1): void {
  const target = index + dir;
  if (target < 0 || target >= tabs.value.length) return;
  const list = [...tabs.value];
  [list[index], list[target]] = [list[target], list[index]];
  emitList(list);
}
</script>

<template>
  <div class="lb-tabs-setter">
    <div class="lb-tabs-setter__list">
      <div
        v-for="(tab, i) in tabs"
        :key="tab.id ?? i"
        class="lb-tabs-setter__item"
      >
        <span class="lb-tabs-setter__handle" title="拖拽排序">⠿</span>
        <input
          class="lb-tabs-setter__input"
          type="text"
          :value="tab.label"
          placeholder="标签名"
          @input="update(i, { label: ($event.target as HTMLInputElement).value })"
        />
        <input
          class="lb-tabs-setter__input lb-tabs-setter__input--key"
          type="text"
          :value="tab.key"
          placeholder="key"
          @input="update(i, { key: ($event.target as HTMLInputElement).value })"
        />
        <div class="lb-tabs-setter__actions">
          <button title="上移" :disabled="i === 0" @click="move(i, -1)">←</button>
          <button title="下移" :disabled="i === tabs.length - 1" @click="move(i, 1)">→</button>
          <button class="lb-tabs-setter__del" title="删除" @click="remove(i)">✕</button>
        </div>
      </div>
    </div>
    <button class="lb-tabs-setter__add" @click="add">+ 添加标签</button>
    <p v-if="tabs.length === 0" class="lb-tabs-setter__empty">暂无标签页</p>
  </div>
</template>

<style scoped>
.lb-tabs-setter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lb-tabs-setter__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lb-tabs-setter__item {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
.lb-tabs-setter__handle {
  color: #c0c4cc;
  cursor: grab;
  font-size: 14px;
}
.lb-tabs-setter__input {
  flex: 1;
  height: 26px;
  padding: 0 6px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  font-size: 12px;
  min-width: 0;
}
.lb-tabs-setter__input--key {
  max-width: 70px;
  font-family: monospace;
}
.lb-tabs-setter__input:focus {
  border-color: #409eff;
  outline: none;
}
.lb-tabs-setter__actions {
  display: flex;
  gap: 2px;
}
.lb-tabs-setter__actions button {
  width: 22px;
  height: 22px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  color: #606266;
  padding: 0;
}
.lb-tabs-setter__actions button:hover:not(:disabled) {
  background: #ecf5ff;
  color: #409eff;
}
.lb-tabs-setter__actions button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.lb-tabs-setter__del:hover:not(:disabled) {
  background: #fef0f0 !important;
  color: #f56c6c !important;
}
.lb-tabs-setter__add {
  padding: 6px;
  border: 1px dashed #409eff;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.lb-tabs-setter__add:hover {
  background: #d9ecff;
}
.lb-tabs-setter__empty {
  text-align: center;
  font-size: 11px;
  color: #c0c4cc;
  margin: 0;
}
</style>
