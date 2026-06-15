<script lang="ts">
export default { name: 'OutlineTree' };
</script>

<script setup lang="ts">
import { computed } from 'vue';
import type { PageSchema, NodeSchema } from './schema';
import { getComponentMeta } from './componentMeta';

/**
 * 大纲树（T-ui-6）：以树形结构呈现 schema.root，支持选中/删除/复制/上下移动。
 * 递归渲染节点（含 children）。
 */
const props = withDefaults(
  defineProps<{
    schema?: PageSchema;
    /** 当前渲染的子节点列表（递归时由父节点传入） */
    nodes?: NodeSchema[];
    /** 递归深度（控制缩进） */
    depth?: number;
    selectedId?: string | null;
  }>(),
  {
    schema: undefined,
    nodes: undefined,
    depth: 0,
    selectedId: null,
  }
);

const emit = defineEmits<{
  select: [nodeId: string];
  delete: [nodeId: string];
  duplicate: [nodeId: string];
  reorder: [nodeId: string, direction: 'up' | 'down'];
}>();

/** 渲染目标节点列表：顶层用 schema.root.children，递归层用 nodes prop。 */
const renderNodes = computed<NodeSchema[]>(() => {
  if (props.nodes) return props.nodes;
  return props.schema?.root.children ?? [];
});

function labelOf(type: string): string {
  return getComponentMeta(type)?.label ?? type;
}

function onSelect(node: NodeSchema): void {
  emit('select', node.id);
}
function bubbleSelect(id: string): void {
  emit('select', id);
}
function bubbleDelete(id: string): void {
  emit('delete', id);
}
function bubbleDuplicate(id: string): void {
  emit('duplicate', id);
}
function bubbleReorder(id: string, dir: 'up' | 'down'): void {
  emit('reorder', id, dir);
}
</script>

<template>
  <div class="lb-outline-tree">
    <div
      v-for="node in renderNodes"
      :key="node.id"
      class="lb-outline-node"
    >
      <div
        class="lb-outline-node__row"
        :class="{ 'lb-outline-node__row--selected': selectedId === node.id }"
        :style="{ paddingLeft: `${depth * 16 + 8}px` }"
        @click.stop="onSelect(node)"
      >
        <span class="lb-outline-node__label">{{ labelOf(node.type) }}</span>
        <span class="lb-outline-node__actions">
          <button
            class="lb-outline-node__btn"
            title="上移"
            @click.stop="bubbleReorder(node.id, 'up')"
          >↑</button>
          <button
            class="lb-outline-node__btn"
            title="下移"
            @click.stop="bubbleReorder(node.id, 'down')"
          >↓</button>
          <button
            class="lb-outline-node__btn"
            title="复制"
            @click.stop="bubbleDuplicate(node.id)"
          >⧉</button>
          <button
            class="lb-outline-node__btn lb-outline-node__btn--danger"
            title="删除"
            @click.stop="bubbleDelete(node.id)"
          >🗑</button>
        </span>
      </div>
      <!-- 递归渲染 children（自引用：组件名为 OutlineTree） -->
      <OutlineTree
        v-if="node.children?.length"
        :nodes="node.children"
        :depth="depth + 1"
        :selected-id="selectedId"
        @select="bubbleSelect"
        @delete="bubbleDelete"
        @duplicate="bubbleDuplicate"
        @reorder="bubbleReorder"
      />
    </div>
    <div v-if="renderNodes.length === 0" class="lb-outline-tree__empty">暂无节点</div>
  </div>
</template>

<style scoped>
.lb-outline-tree {
  font-size: 13px;
  color: #333;
  user-select: none;
}
.lb-outline-tree__empty {
  color: #999;
  padding: 8px;
}
.lb-outline-node__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.lb-outline-node__row:hover {
  background: #f5f5f5;
}
.lb-outline-node__row--selected {
  background: #e3f2fd;
}
.lb-outline-node__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lb-outline-node__actions {
  display: none;
  gap: 2px;
}
.lb-outline-node__row:hover .lb-outline-node__actions {
  display: flex;
}
.lb-outline-node__btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 12px;
  color: #666;
  border-radius: 3px;
}
.lb-outline-node__btn:hover {
  background: #e0e0e0;
}
.lb-outline-node__btn--danger:hover {
  color: #d32f2f;
}
</style>
