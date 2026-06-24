<script setup lang="ts">
/**
 * 节点浮动工具条（T-ui-d7）：在选中或 hover 节点时显示。
 * 按钮：复制 / 删除 / 拖拽手柄。
 * 通过 DesignRenderer 的 wrapper 定位（绝对定位到 wrapper 右上角）。
 */
defineEmits<{
  copy: [];
  delete: [];
}>();
</script>

<template>
  <div class="lb-node-toolbar" @click.stop @mousedown.stop>
    <button class="lb-node-toolbar__btn" title="复制 (Ctrl+D)" @click="$emit('copy')">
      ⧉
    </button>
    <button class="lb-node-toolbar__btn lb-node-toolbar__btn--danger" title="删除 (Delete)" @click="$emit('delete')">
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
</style>
