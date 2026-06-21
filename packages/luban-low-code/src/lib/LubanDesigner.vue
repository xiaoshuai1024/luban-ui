<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Sortable from 'sortablejs';
import RuntimeRenderer from './RuntimeRenderer.vue';
import DesignRenderer from './DesignRenderer.vue';
import { getComponent } from './registry';
import type { PageSchema, ResponsiveBreakpoint } from './schema';
import { computeAlignGuides, collectNodeRects, dedupeGuides, type GuideLine } from './alignGuides';

/**
 * V2-T12 拖拽对齐辅助线。
 * hover 节点时计算与其他节点的边缘/中线对齐，显示辅助线 overlay。
 * alignGuidesEnabled 运行时可关（默认开）。
 */
const alignGuidesEnabled = ref(true);
const activeGuides = ref<GuideLine[]>([]);
const canvasRef = ref<HTMLElement | null>(null);

/** hover 节点时显示对齐辅助线（dragging 节点 = hovered） */
function onCanvasMouseMove(e: MouseEvent): void {
  if (!alignGuidesEnabled.value || !canvasRef.value) {
    activeGuides.value = [];
    return;
  }
  const target = (e.target as HTMLElement)?.closest('[data-lb-node]') as HTMLElement | null;
  if (!target) {
    activeGuides.value = [];
    return;
  }
  const draggingId = target.dataset.lbNode;
  if (!draggingId) {
    activeGuides.value = [];
    return;
  }
  const others = collectNodeRects(canvasRef.value, draggingId);
  if (others.length === 0) {
    activeGuides.value = [];
    return;
  }
  const containerRect = canvasRef.value.getBoundingClientRect();
  const r = target.getBoundingClientRect();
  const draggingRect = {
    id: draggingId,
    left: r.left - containerRect.left,
    top: r.top - containerRect.top,
    width: r.width,
    height: r.height,
  };
  const result = computeAlignGuides(draggingRect, others);
  activeGuides.value = dedupeGuides(result.guides);
}

function clearGuides(): void {
  activeGuides.value = [];
}

onBeforeUnmount(clearGuides);

const props = withDefaults(
  defineProps<{
    schema: PageSchema | null | undefined;
    showToolbar?: boolean;
    placeholder?: string;
    /** When true, use DesignRenderer (selectable nodes, empty placeholders, Sortable reorder) and emit select/add-node/reorder */
    designMode?: boolean;
    /** V2-T4 设计态当前断点：透传给 DesignRenderer 渲染对应断点 style */
    breakpoint?: ResponsiveBreakpoint;
  }>(),
  { showToolbar: true, placeholder: '从左侧拖拽组件到此处', designMode: false, breakpoint: 'desktop' }
);

const emit = defineEmits<{
  'update:schema': [value: PageSchema | null | undefined];
  select: [nodeId: string | null];
  /** Emit when a node type is dropped from palette; parentId 未传表示追加到 root.children，否则追加到该 id 对应节点（如表单）的 children */
  'add-node': [type: string, parentId?: string];
  /** Emit when root.children are reordered (fromIndex, toIndex); parent may call reorderRootChildren */
  reorder: [fromIndex: number, toIndex: number];
  /** 跨容器拖拽：nodeId 从 fromParentId 移到 toParentId 的 toIndex（null=root 级） */
  'move-node': [nodeId: string, fromParentId: string | null, toParentId: string | null, toIndex: number];
}>();

const formState = computed(() => props.schema?.formState ?? {});
const formErrors = ref<Record<string, string>>({});
const selectedNodeId = ref<string | null>(null);
const sortableRef = ref<HTMLElement | null>(null);
let sortableInstance: Sortable | null = null;

watch(
  () => props.schema?.root?.id,
  () => {
    formErrors.value = {};
  }
);

function onSelect(nodeId: string | null): void {
  selectedNodeId.value = nodeId;
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
  sortableRef.value.dataset.parentId = ''; // root 级标识
  sortableInstance = Sortable.create(sortableRef.value, {
    animation: 150,
    group: 'luban-nodes',
    // FINDING-1: locked nodes can't be dragged out (plan §4.2).
    filter: '.design-renderer__wrapper--locked',
    preventOnFilter: false,
    onEnd(ev) {
      const oldIndex = ev.oldIndex;
      const newIndex = ev.newIndex;
      if (oldIndex == null || newIndex == null) return;
      const fromParent = (ev.from as HTMLElement).dataset.parentId ?? '';
      const toParent = (ev.to as HTMLElement).dataset.parentId ?? '';
      const nodeId = (ev.item as HTMLElement).dataset.nodeId ?? '';
      // revert DOM：跨容器时还原 Sortable 的 DOM 移动，交由 Vue 按 schema 重渲染
      if (ev.from !== ev.to && ev.item.parentNode === ev.to) {
        ev.from.insertBefore(ev.item, ev.from.children[oldIndex] ?? null);
      }
      if (!nodeId) return;
      if (fromParent === toParent) {
        emit('reorder', oldIndex, newIndex);
      } else {
        emit('move-node', nodeId, fromParent || null, toParent || null, newIndex);
      }
    },
  });
}

onMounted(() => {
  initSortable();
});

watch(
  () => props.schema?.root?.children?.length,
  () => {
    nextTick(() => initSortable());
  }
);
</script>

<template>
  <div class="luban-designer">
    <slot v-if="showToolbar" name="toolbar" />
    <div
      v-if="schema?.root"
      ref="canvasRef"
      class="luban-designer__canvas"
      :class="{ 'luban-designer__canvas--design': designMode }"
      @dragover="designMode ? onPaletteDragOver : undefined"
      @drop="designMode ? onPaletteDrop : undefined"
      @mousemove="designMode ? onCanvasMouseMove : undefined"
      @mouseleave="clearGuides"
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
              :data-node-id="child.id"
            >
              <DesignRenderer
                :root="child"
                :form-state="formState"
                :form-errors="formErrors"
                :selected-node-id="selectedNodeId"
                :placeholder-text="placeholder"
                :breakpoint="breakpoint"
                @select="onSelect"
                @add-node="(type, parentId) => emit('add-node', type, parentId)"
                @move-node="(nodeId, from, to, idx) => emit('move-node', nodeId, from, to, idx)"
              />
            </div>
          </div>
          <div
            v-else
            class="luban-designer__placeholder"
            @dragover.prevent="onPaletteDragOver"
            @drop="onPaletteDrop"
          >
            {{ placeholder }}
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
      <!-- V2-T12 对齐辅助线 overlay -->
      <div v-if="activeGuides.length" class="luban-designer__guides" aria-hidden="true">
        <template v-for="(g, i) in activeGuides" :key="i">
          <div
            v-if="g.orientation === 'vertical'"
            class="luban-designer__guide luban-designer__guide--vertical"
            :style="{ left: g.position + 'px', top: g.start + 'px', height: (g.end - g.start) + 'px' }"
          />
          <div
            v-else
            class="luban-designer__guide luban-designer__guide--horizontal"
            :style="{ top: g.position + 'px', left: g.start + 'px', width: (g.end - g.start) + 'px' }"
          />
        </template>
      </div>
    </div>
    <div v-else class="luban-designer__placeholder">
      {{ placeholder }}
    </div>
  </div>
</template>

<style scoped>
.luban-designer__canvas {
  position: relative;
}
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
  align-items: center;
  justify-content: center;
  color: #999;
  border: 1px dashed #ccc;
  border-radius: 4px;
}
.luban-designer__canvas-spacer {
  min-height: 160px;
}

/* V2-T12 对齐辅助线 */
.luban-designer__guides {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}
.luban-designer__guide {
  position: absolute;
  background: #ff3b30;
}
.luban-designer__guide--vertical {
  width: 1px;
}
.luban-designer__guide--horizontal {
  height: 1px;
}
</style>
