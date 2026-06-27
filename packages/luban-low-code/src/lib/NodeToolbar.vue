<script setup lang="ts">
/**
 * 节点浮动工具条（T-ui-d7）：在选中或 hover 节点时显示。
 * 按钮：上移层级 / 下移层级 / 复制 / 删除。
 * 通过 DesignRenderer 的 wrapper 定位（绝对定位到 wrapper 右上角）。
 *
 * T-ui-5：新增层级控制按钮（move-up/move-down），便于在设计态快速调整节点顺序。
 */
const props = defineProps<{
  /** 是否处于容器首位（首位时禁用上移） */
  isFirst?: boolean;
  /** 是否处于容器末位（末位时禁用下移） */
  isLast?: boolean;
}>();

defineEmits<{
  'move-up': [];
  'move-down': [];
  copy: [];
  delete: [];
}>();

// 内联纯 CSS tooltip（不引入 tippy.js，零额外依赖）
</script>

<template>
  <div
    class="lb-node-toolbar"
    @click.stop
    @mousedown.stop
  >
    <!-- T-ui-5：层级上移（首位时禁用） -->
    <button
      class="lb-node-toolbar__btn"
      :class="{ 'lb-node-toolbar__btn--disabled': props.isFirst }"
      :disabled="props.isFirst"
      title="上移层级"
      @click="!props.isFirst && $emit('move-up')"
    >
      ↑
    </button>
    <!-- T-ui-5：层级下移（末位时禁用） -->
    <button
      class="lb-node-toolbar__btn"
      :class="{ 'lb-node-toolbar__btn--disabled': props.isLast }"
      :disabled="props.isLast"
      title="下移层级"
      @click="!props.isLast && $emit('move-down')"
    >
      ↓
    </button>
    <button
      class="lb-node-toolbar__btn"
      title="复制 (Ctrl+D)"
      @click="$emit('copy')"
    >
      ⧉
    </button>
    <button
      class="lb-node-toolbar__btn lb-node-toolbar__btn--danger"
      title="删除 (Delete)"
      @click="$emit('delete')"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.lb-node-toolbar {
  position: absolute;
  top: -14px;
  right: 0;
  display: flex;
  gap: 2px;
  background: #303133;
  border-radius: 4px;
  padding: 2px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.lb-node-toolbar__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  color: #c0c4cc;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.12s ease;
}
.lb-node-toolbar__btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.lb-node-toolbar__btn--danger:hover {
  background: #f56c6c;
  color: #fff;
}
/* T-ui-5：层级按钮禁用态（首位/末位不可再移） */
.lb-node-toolbar__btn--disabled,
.lb-node-toolbar__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.lb-node-toolbar__btn--disabled:hover {
  background: transparent;
  color: #c0c4cc;
}
</style>
