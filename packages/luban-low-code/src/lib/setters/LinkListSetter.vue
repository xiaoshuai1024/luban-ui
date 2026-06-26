<script setup lang="ts">
/**
 * 链接列表编辑器（T-ui-d18）：导航/页脚链接列表增删改。
 * modelValue 为 LinkItem[]（label + href + 可选 target）。
 */
import { computed } from 'vue';

export interface LinkItem {
  id?: string;
  label: string;
  href: string;
  target?: '_self' | '_blank';
}

const props = withDefaults(
  defineProps<{
    modelValue?: LinkItem[];
  }>(),
  { modelValue: () => [] },
);

const emit = defineEmits<{
  'update:modelValue': [value: LinkItem[]];
}>();

const links = computed<LinkItem[]>(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : [];
});

let _seq = 0;
function genId(): string {
  _seq++;
  return `link-${Date.now().toString(36)}-${_seq}`;
}

function emitList(list: LinkItem[]): void {
  emit(
    'update:modelValue',
    list.map((l) => ({ ...l })),
  );
}

function add(): void {
  emitList([
    ...links.value,
    { id: genId(), label: '新链接', href: '#', target: '_self' },
  ]);
}

function remove(index: number): void {
  emitList(links.value.filter((_, i) => i !== index));
}

function update(index: number, patch: Partial<LinkItem>): void {
  emitList(links.value.map((l, i) => (i === index ? { ...l, ...patch } : l)));
}

function move(index: number, dir: -1 | 1): void {
  const target = index + dir;
  if (target < 0 || target >= links.value.length) return;
  const list = [...links.value];
  [list[index], list[target]] = [list[target], list[index]];
  emitList(list);
}
</script>

<template>
  <div class="lb-linklist-setter">
    <div class="lb-linklist-setter__list">
      <div
        v-for="(link, i) in links"
        :key="link.id ?? i"
        class="lb-linklist-setter__item"
      >
        <input
          class="lb-linklist-setter__input lb-linklist-setter__input--label"
          type="text"
          :value="link.label"
          placeholder="显示文字"
          @input="
            update(i, { label: ($event.target as HTMLInputElement).value })
          "
        >
        <input
          class="lb-linklist-setter__input"
          type="text"
          :value="link.href"
          placeholder="链接地址"
          @input="
            update(i, { href: ($event.target as HTMLInputElement).value })
          "
        >
        <select
          class="lb-linklist-setter__select"
          :value="link.target ?? '_self'"
          @change="
            update(i, {
              target: ($event.target as HTMLSelectElement).value as
                | '_self'
                | '_blank',
            })
          "
        >
          <option value="_self">
            当前页
          </option>
          <option value="_blank">
            新窗口
          </option>
        </select>
        <div class="lb-linklist-setter__actions">
          <button
            title="上移"
            :disabled="i === 0"
            @click="move(i, -1)"
          >
            ↑
          </button>
          <button
            title="下移"
            :disabled="i === links.length - 1"
            @click="move(i, 1)"
          >
            ↓
          </button>
          <button
            class="lb-linklist-setter__del"
            title="删除"
            @click="remove(i)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    <button
      class="lb-linklist-setter__add"
      @click="add"
    >
      + 添加链接
    </button>
    <p
      v-if="links.length === 0"
      class="lb-linklist-setter__empty"
    >
      暂无链接
    </p>
  </div>
</template>

<style scoped>
.lb-linklist-setter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lb-linklist-setter__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lb-linklist-setter__item {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
.lb-linklist-setter__input {
  flex: 1;
  height: 26px;
  padding: 0 6px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  font-size: 12px;
  min-width: 0;
}
.lb-linklist-setter__input--label {
  max-width: 90px;
  flex-shrink: 0;
}
.lb-linklist-setter__input:focus {
  border-color: #409eff;
  outline: none;
}
.lb-linklist-setter__select {
  height: 26px;
  padding: 0 4px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  font-size: 11px;
  background: #fff;
}
.lb-linklist-setter__actions {
  display: flex;
  gap: 2px;
}
.lb-linklist-setter__actions button {
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
.lb-linklist-setter__actions button:hover:not(:disabled) {
  background: #ecf5ff;
  color: #409eff;
}
.lb-linklist-setter__actions button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.lb-linklist-setter__del:hover:not(:disabled) {
  background: #fef0f0 !important;
  color: #f56c6c !important;
}
.lb-linklist-setter__add {
  padding: 6px;
  border: 1px dashed #409eff;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.lb-linklist-setter__add:hover {
  background: #d9ecff;
}
.lb-linklist-setter__empty {
  text-align: center;
  font-size: 11px;
  color: #c0c4cc;
  margin: 0;
}
</style>
