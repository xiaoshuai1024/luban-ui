<script setup lang="ts">
import { computed, ref } from 'vue';
import { getComponent } from './registry';
import type { NodeSchema } from './schema';
import { isContainerType, isFormValueType } from './constants';
import { validate, type ValidationRule } from './validation';
import DesignRendererSelf from './DesignRenderer.vue';
import NodeToolbar from './NodeToolbar.vue';

// FORM_VALUE_TYPES 从 constants 统一导入（T-ui-12 单一真相源），新增表单值物料自动生效

const props = withDefaults(
  defineProps<{
    root: NodeSchema;
    formState: Record<string, unknown>;
    formErrors?: Record<string, string>;
    selectedNodeId: string | null;
    placeholderText?: string;
    /** 是否可被删除/复制（root 节点为 false） */
    isRoot?: boolean;
  }>(),
  { formErrors: () => ({}), placeholderText: '拖拽组件到此处', isRoot: false }
);

const emit = defineEmits<{
  select: [nodeId: string | null];
  /** 从面板拖入到当前容器时发出；parentId 为当前节点 id */
  'add-node': [type: string, parentId: string];
  /** 复制节点 */
  copy: [nodeId: string];
  /** 删除节点 */
  delete: [nodeId: string];
  /** 右键菜单（坐标 + 节点 id） */
  'context-menu': [x: number, y: number, nodeId: string];
}>();

// hover 态用于显示 NodeToolbar（即便未选中）
const hovered = ref(false);
const isSelected = computed(() => props.selectedNodeId === props.root.id);
const showToolbar = computed(
  () => !props.isRoot && (isSelected.value || hovered.value)
);

function onWrapperClick(e: Event, nodeId: string): void {
  e.stopPropagation();
  emit('select', nodeId);
}

function onPlaceholderClick(e: Event): void {
  e.stopPropagation();
  emit('select', props.root.id);
}

const isEmptyContainer = (): boolean =>
  isContainerType(props.root.type) &&
  (props.root.children?.length ?? 0) === 0;

function getFormValue(name: string | undefined): unknown {
  if (name == null) return undefined;
  return props.formState[name];
}

function setFormValue(name: string | undefined, value: unknown): void {
  if (name == null) return;
  const state = props.formState as Record<string, unknown>;
  if (name in state) {
    state[name] = value;
    const rules = props.root.props?.rules as ValidationRule[] | undefined;
    const message = validate(value, rules);
    if (message) {
      (props.formErrors as Record<string, string>)[name] = message;
    } else {
      delete (props.formErrors as Record<string, string>)[name];
    }
  }
}

function getFieldError(name: string | undefined): string | undefined {
  if (name == null) return undefined;
  return props.formErrors[name];
}

function validateField(name: string | undefined): void {
  if (name == null) return;
  const value = getFormValue(name);
  const rules = props.root.props?.rules as ValidationRule[] | undefined;
  const message = validate(value, rules);
  const err = props.formErrors as Record<string, string>;
  if (message) err[name] = message;
  else delete err[name];
}

function formValueProps(
  nodeProps: Record<string, unknown> | undefined,
  name: string | undefined
): Record<string, unknown> {
  if (nodeProps == null) return {};
  const { content: _c, text: _t, rules: _r, ...rest } = nodeProps;
  const errorMessage = getFieldError(name);
  return {
    ...rest,
    error: !!errorMessage,
    errorMessage: errorMessage ?? undefined,
  };
}

function componentProps(
  nodeProps: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (nodeProps == null) return {};
  const { content: _c, text: _t, rules: _r, style: _s, responsive: _rs, ...rest } = nodeProps;
  return rest;
}

/** 合并节点样式（设计态所见即所得，T-web-d1 同源） */
function mergedStyle(nodeProps: Record<string, unknown> | undefined): Record<string, string> | undefined {
  if (!nodeProps) return undefined;
  const style = (nodeProps.style as Record<string, string> | undefined) ?? {};
  const responsive = nodeProps.responsive as { pc?: Record<string, string>; tablet?: Record<string, string>; mobile?: Record<string, string> } | undefined;
  if (!responsive) return Object.keys(style).length > 0 ? style : undefined;
  return { ...style, ...(responsive.pc ?? {}), ...(responsive.tablet ?? {}), ...(responsive.mobile ?? {}) };
}

function slotContent(): string {
  const p = props.root.props;
  if (p?.content != null) return String(p.content);
  if (p?.text != null) return String(p.text);
  return '';
}

function onContainerDragOver(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
}

function onContainerDrop(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
  const raw = e.dataTransfer?.getData('application/json');
  if (!raw) return;
  try {
    const data = JSON.parse(raw) as { type?: string };
    if (data?.type) emit('add-node', data.type, props.root.id);
  } catch {
    // ignore
  }
}

/** 右键：选中当前节点并 emit 坐标（仅非 root 节点可触发菜单） */
function onContextMenu(e: MouseEvent): void {
  if (props.isRoot) return;
  e.preventDefault();
  e.stopPropagation();
  emit('select', props.root.id);
  emit('context-menu', e.clientX, e.clientY, props.root.id);
}

function onCopy(): void {
  emit('copy', props.root.id);
}

function onDelete(): void {
  emit('delete', props.root.id);
}
</script>

<template>
  <template v-if="root">
    <div
      class="design-renderer__wrapper"
      :class="{
        'design-renderer__wrapper--selected': selectedNodeId === root.id,
        'design-renderer__wrapper--root': isRoot,
      }"
      @click="onWrapperClick($event, root.id)"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      @contextmenu="onContextMenu"
    >
      <!-- 节点浮动工具条（hover/选中显示，仅非 root） -->
      <NodeToolbar
        v-if="showToolbar"
        @copy="onCopy"
        @delete="onDelete"
      />
      <template v-if="isEmptyContainer()">
        <div
          class="design-renderer__placeholder"
          @click="onPlaceholderClick"
          @dragover.prevent="onContainerDragOver"
          @drop="onContainerDrop"
        >
          {{ placeholderText }}
        </div>
      </template>
      <template v-else>
        <!-- Form value components -->
        <component
          v-if="getComponent(root.type) && isFormValueType(root.type)"
          :is="getComponent(root.type)"
          v-bind="
            formValueProps(
              root.props as Record<string, unknown>,
              root.props?.name as string
            )
          "
          :style="mergedStyle(root.props as Record<string, unknown>)"
          :model-value="
            root.props?.name != null
              ? getFormValue(root.props.name as string)
              : undefined
          "
          @update:model-value="
            root.props?.name != null
              ? setFormValue(root.props.name as string, $event)
              : () => {}
          "
          @blur="validateField(root.props?.name as string)"
        >
          <DesignRendererSelf
            v-for="child in (root.children ?? [])"
            :key="child.id"
            :root="child"
            :form-state="formState"
            :form-errors="formErrors"
            :selected-node-id="selectedNodeId"
            :placeholder-text="placeholderText"
            @select="emit('select', $event)"
            @add-node="emit('add-node', $event[0], $event[1])"
            @copy="emit('copy', $event)"
            @delete="emit('delete', $event)"
            @context-menu="emit('context-menu', $event[0], $event[1], $event[2])"
          />
        </component>
        <!-- Non-form components: props + slot from content or DesignRenderer children -->
        <component
          v-else-if="getComponent(root.type)"
          :is="getComponent(root.type)"
          v-bind="componentProps(root.props as Record<string, unknown>)"
          :style="mergedStyle(root.props as Record<string, unknown>)"
        >
          <template v-if="(root.children ?? []).length">
            <div
              class="design-renderer__container-drop"
              @dragover.prevent="onContainerDragOver"
              @drop="onContainerDrop"
            >
              <DesignRendererSelf
                v-for="child in (root.children ?? [])"
                :key="child.id"
                :root="child"
                :form-state="formState"
                :form-errors="formErrors"
                :selected-node-id="selectedNodeId"
                :placeholder-text="placeholderText"
                @select="emit('select', $event)"
                @add-node="emit('add-node', $event[0], $event[1])"
                @copy="emit('copy', $event)"
                @delete="emit('delete', $event)"
                @context-menu="emit('context-menu', $event[0], $event[1], $event[2])"
              />
            </div>
          </template>
          <template v-else-if="slotContent()">{{ slotContent() }}</template>
        </component>
        <template v-else>
          <DesignRendererSelf
            v-for="child in (root.children ?? [])"
            :key="child.id"
            :root="child"
            :form-state="formState"
            :form-errors="formErrors"
            :selected-node-id="selectedNodeId"
            :placeholder-text="placeholderText"
            @select="emit('select', $event)"
            @add-node="emit('add-node', $event[0], $event[1])"
            @copy="emit('copy', $event)"
            @delete="emit('delete', $event)"
            @context-menu="emit('context-menu', $event[0], $event[1], $event[2])"
          />
        </template>
      </template>
    </div>
  </template>
</template>

<style scoped>
.design-renderer__wrapper {
  position: relative;
  min-height: 24px;
  outline: 1px solid transparent;
  outline-offset: -1px;
  border-radius: 4px;
  transition: outline-color 0.15s ease;
}
.design-renderer__wrapper:hover {
  outline-color: rgba(30, 136, 229, 0.35);
}
.design-renderer__wrapper--selected {
  outline: 2px solid #1e88e5;
  outline-offset: 0;
}
/* root 节点不显示 hover 外框 */
.design-renderer__wrapper--root:hover {
  outline-color: transparent;
}
/* NodeToolbar 由 v-if 控制显示，强制覆盖 opacity */
.design-renderer__wrapper :deep(.lb-node-toolbar) {
  opacity: 1;
  pointer-events: auto;
}
.design-renderer__placeholder {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 13px;
  border: 2px dashed rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  margin: 4px 0;
}
.design-renderer__container-drop {
  min-height: 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
