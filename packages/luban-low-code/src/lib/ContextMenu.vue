<script setup lang="ts">
import { watch, nextTick, ref } from 'vue';

/**
 * 右键上下文菜单（T-ui-d11）：复制 / 粘贴 / 删除 / 置顶 / 置底 / 上移 / 下移 / 转容器。
 * 通过 fixed 定位到鼠标坐标，纯展示组件，所有操作 emit 上抛由 PageEditor 处理。
 * 仅在 nodeType 存在时渲染（无选中节点不显示）。
 */

type MenuAction =
  | 'copy'
  | 'paste'
  | 'delete'
  | 'bring-front'
  | 'send-back'
  | 'move-up'
  | 'move-down';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    x: number;
    y: number;
    /** 是否可粘贴（剪贴板有内容） */
    canPaste?: boolean;
    /** 是否为容器（容器显示"转容器"禁用） */
    isContainer?: boolean;
  }>(),
  { canPaste: false, isContainer: false },
);

const emit = defineEmits<{
  action: [action: MenuAction];
  close: [];
}>();

const menuRef = ref<HTMLElement | null>(null);

// 防止菜单溢出视口：实际渲染后微调位置
const adjustedPos = ref({ x: 0, y: 0 });

watch(
  () => [props.visible, props.x, props.y] as const,
  async ([visible]) => {
    if (!visible) return;
    await nextTick();
    const el = menuRef.value;
    if (!el) {
      adjustedPos.value = { x: props.x, y: props.y };
      return;
    }
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = props.x + rect.width > vw ? vw - rect.width - 8 : props.x;
    const y = props.y + rect.height > vh ? vh - rect.height - 8 : props.y;
    adjustedPos.value = { x: Math.max(8, x), y: Math.max(8, y) };
  },
  { immediate: true },
);

interface MenuItem {
  action: MenuAction;
  label: string;
  icon: string;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  dividerAfter?: boolean;
}

const menuItems = (): MenuItem[] => [
  { action: 'copy', label: '复制', icon: '⧉', shortcut: 'Ctrl+C' },
  {
    action: 'paste',
    label: '粘贴',
    icon: '📋',
    shortcut: 'Ctrl+V',
    disabled: !props.canPaste,
    dividerAfter: true,
  },
  { action: 'move-up', label: '上移', icon: '↑', shortcut: 'Ctrl+↑' },
  { action: 'move-down', label: '下移', icon: '↓', shortcut: 'Ctrl+↓' },
  { action: 'bring-front', label: '置顶', icon: '⤒' },
  { action: 'send-back', label: '置底', icon: '⤓', dividerAfter: true },
  {
    action: 'delete',
    label: '删除',
    icon: '🗑',
    shortcut: 'Delete',
    danger: true,
  },
];

function onAction(action: MenuAction): void {
  emit('action', action);
  emit('close');
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="lb-context-menu__overlay"
      @click="emit('close')"
      @contextmenu.prevent="emit('close')"
    >
      <ul
        ref="menuRef"
        class="lb-context-menu"
        :style="{ left: `${adjustedPos.x}px`, top: `${adjustedPos.y}px` }"
        @click.stop
        @contextmenu.prevent.stop
      >
        <li
          v-for="item in menuItems()"
          :key="item.action"
          class="lb-context-menu__item"
          :class="{
            'lb-context-menu__item--danger': item.danger,
            'lb-context-menu__item--disabled': item.disabled,
            'lb-context-menu__item--divider': item.dividerAfter,
          }"
          @click="!item.disabled && onAction(item.action)"
        >
          <span class="lb-context-menu__icon">{{ item.icon }}</span>
          <span class="lb-context-menu__label">{{ item.label }}</span>
          <span v-if="item.shortcut" class="lb-context-menu__shortcut">{{
            item.shortcut
          }}</span>
        </li>
      </ul>
    </div>
  </Teleport>
</template>

<style scoped>
.lb-context-menu__overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
}
.lb-context-menu {
  position: fixed;
  min-width: 168px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background: #fff;
  border-radius: 8px;
  box-shadow:
    0 6px 24px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  z-index: 2001;
  font-size: 13px;
  animation: lb-ctx-in 0.12s ease;
}
@keyframes lb-ctx-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.lb-context-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  cursor: pointer;
  color: #303133;
  transition: background 0.1s ease;
  user-select: none;
}
.lb-context-menu__item:hover:not(.lb-context-menu__item--disabled) {
  background: #f0f2f5;
}
.lb-context-menu__item--danger {
  color: #f56c6c;
}
.lb-context-menu__item--danger:hover:not(.lb-context-menu__item--disabled) {
  background: #fef0f0;
}
.lb-context-menu__item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.lb-context-menu__item--divider {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 4px;
  padding-bottom: 11px;
}
.lb-context-menu__icon {
  width: 16px;
  text-align: center;
  font-size: 13px;
  flex-shrink: 0;
}
.lb-context-menu__label {
  flex: 1;
}
.lb-context-menu__shortcut {
  font-size: 11px;
  color: #c0c4cc;
}
</style>
