<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Sortable from 'sortablejs';
import RuntimeRenderer from './RuntimeRenderer.vue';
import DesignRenderer from './DesignRenderer.vue';
import { getComponent } from './registry';
import type { PageSchema } from './schema';

/**
 * 设计器画布容器（重写 T-ui-d22）：
 * - designMode 时渲染 DesignRenderer（可选节点 + 空容器引导 + Sortable 重排）
 * - selectedNodeId 双向同步（v-model:selected-node-id），画布/面板/大纲三处联动
 * - 透传 DesignRenderer 的 copy/delete/context-menu 事件
 * - 非 designMode 时走 RuntimeRenderer（预览/访客视角）
 * - 空页面引导：schema 为空或 root 无子节点时显示拖拽提示
 */
const props = withDefaults(
  defineProps<{
    schema: PageSchema | null | undefined;
    showToolbar?: boolean;
    placeholder?: string;
    /** 设计模式：渲染 DesignRenderer 并支持选中/拖拽 */
    designMode?: boolean;
    /** 选中节点 id（双向） */
    selectedNodeId?: string | null;
  }>(),
  {
    showToolbar: true,
    placeholder: '从左侧拖拽组件到此处',
    designMode: false,
    selectedNodeId: null,
  }
);

const emit = defineEmits<{
  'update:schema': [value: PageSchema | null | undefined];
  'update:selectedNodeId': [value: string | null];
  select: [nodeId: string | null];
  /** 从面板拖入；parentId 缺省表示追加到 root.children */
  'add-node': [type: string, parentId?: string];
  /** root.children 重排（fromIndex, toIndex） */
  reorder: [fromIndex: number, toIndex: number];
  /** 复制节点 */
  copy: [nodeId: string];
  /** 删除节点 */
  delete: [nodeId: string];
  /** 右键菜单（x, y, nodeId） */
  'context-menu': [x: number, y: number, nodeId: string];
}>();

const formState = computed(() => props.schema?.formState ?? {});
const formErrors = ref<Record<string, string>>({});
const sortableRef = ref<HTMLElement | null>(null);
let sortableInstance: Sortable | null = null;

// 内部 selectedNodeId 用于设计模式本地态，与 prop 双向同步
const internalSelected = ref<string | null>(props.selectedNodeId);

watch(
  () => props.selectedNodeId,
  (val) => {
    if (val !== internalSelected.value) internalSelected.value = val;
  }
);

watch(
  () => props.schema?.root?.id,
  () => {
    formErrors.value = {};
  }
);

function syncSelected(nodeId: string | null): void {
  internalSelected.value = nodeId;
  emit('update:selectedNodeId', nodeId);
  emit('select', nodeId);
}

function onPaletteDragOver(e: DragEvent): void {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
}

function onPaletteDrop(e: DragEvent): void {
  e.preventDefault();
  const raw = e.dataTransfer?.getData('application/json');
  if (!raw) return;
  try {
    const data = JSON.parse(raw) as { type?: string };
    if (data?.type) emit('add-node', data.type);
  } catch {
    // ignore
  }
}

function initSortable(): void {
  if (!sortableRef.value || !props.schema?.root?.children?.length) return;
  sortableInstance?.destroy();
  sortableInstance = Sortable.create(sortableRef.value, {
    animation: 150,
    onEnd(ev) {
      const oldIndex = ev.oldIndex;
      const newIndex = ev.newIndex;
      if (oldIndex == null || newIndex == null) return;
      emit('reorder', oldIndex, newIndex);
    },
  });
}

onMounted(() => {
  initSortable();
});

onBeforeUnmount(() => {
  sortableInstance?.destroy();
  sortableInstance = null;
});

watch(
  () => props.schema?.root?.children?.length,
  () => {
    nextTick(() => initSortable());
  }
);

// 空态判定：root 无子节点
const isEmpty = computed(
  () => !props.schema?.root || (props.schema.root.children ?? []).length === 0
);
</script>

<template>
  <div class="luban-designer">
    <slot v-if="showToolbar" name="toolbar" />
    <div
      v-if="schema?.root"
      class="luban-designer__canvas"
      :class="{ 'luban-designer__canvas--design': designMode }"
      @dragover="designMode ? onPaletteDragOver : undefined"
      @drop="designMode ? onPaletteDrop : undefined"
    >
      <template v-if="designMode">
        <component
          :is="getComponent(schema.root.type)"
          v-bind="(schema.root.props ?? {}) as Record<string, unknown>"
          class="luban-designer__root-container"
        >
          <div
            v-if="(schema.root.children ?? []).length"
            ref="sortableRef"
            class="luban-designer__sortable-list"
          >
            <div
              v-for="child in schema.root.children"
              :key="child.id"
              class="luban-designer__sortable-item"
            >
              <DesignRenderer
                :root="child"
                :form-state="formState"
                :form-errors="formErrors"
                :selected-node-id="internalSelected"
                :placeholder-text="placeholder"
                @select="syncSelected"
                @add-node="(type, parentId) => emit('add-node', type, parentId)"
                @copy="emit('copy', $event)"
                @delete="emit('delete', $event)"
                @context-menu="(x, y, id) => emit('context-menu', x, y, id)"
              />
            </div>
          </div>
          <div
            v-else
            class="luban-designer__placeholder"
            @dragover.prevent="onPaletteDragOver"
            @drop="onPaletteDrop"
          >
            <span class="luban-designer__placeholder-icon">⊹</span>
            <span>{{ placeholder }}</span>
          </div>
        </component>
        <div
          class="luban-designer__canvas-spacer"
          @dragover.prevent="onPaletteDragOver"
          @drop="onPaletteDrop"
        />
      </template>
      <RuntimeRenderer
        v-else
        :root="schema.root"
        :form-state="formState"
        :form-errors="formErrors"
      />
    </div>
    <div
      v-else
      class="luban-designer__placeholder luban-designer__placeholder--page"
      @dragover.prevent="onPaletteDragOver"
      @drop="onPaletteDrop"
    >
      <span class="luban-designer__placeholder-icon">⊹</span>
      <span>{{ placeholder }}</span>
    </div>
  </div>
</template>

<style scoped>
.luban-designer__canvas--design {
  min-height: 200px;
}
.luban-designer__root-container {
  width: 100%;
}
.luban-designer__sortable-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.luban-designer__sortable-item {
  min-height: 24px;
}
.luban-designer__placeholder {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 13px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  background: #fafbfc;
  transition: border-color 0.2s ease, background 0.2s ease;
}
.luban-designer__placeholder:hover {
  border-color: #409eff;
  background: #ecf5ff;
}
.luban-designer__placeholder--page {
  min-height: 320px;
}
.luban-designer__placeholder-icon {
  font-size: 28px;
  color: #c0c4cc;
}
.luban-designer__canvas-spacer {
  min-height: 160px;
}
</style>
