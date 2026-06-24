<script setup lang="ts">
import { computed } from 'vue';

/**
 * 设计器工具栏（T-ui-d5）：撤销/重做、多设备切换、预览/代码模式、
 * 导入/导出、模板、发布、协作状态、缩放控制、底部状态栏。
 * 纯展示组件，所有操作通过 emit 上抛由 PageEditor 处理。
 */
type DeviceType = 'pc' | 'mobile' | 'tablet';
type EditorMode = 'design' | 'preview' | 'code';

const props = withDefaults(
  defineProps<{
    canUndo?: boolean;
    canRedo?: boolean;
    device?: DeviceType;
    mode?: EditorMode;
    saving?: boolean;
    hasUnsavedChanges?: boolean;
    lastSavedAt?: string | null;
    version?: number | null;
    onlineUsers?: string[];
    zoom?: number;
    collabEnabled?: boolean;
  }>(),
  {
    canUndo: false,
    canRedo: false,
    device: 'pc',
    mode: 'design',
    saving: false,
    hasUnsavedChanges: false,
    lastSavedAt: null,
    version: null,
    onlineUsers: () => [],
    zoom: 100,
    collabEnabled: false,
  }
);

const emit = defineEmits<{
  undo: [];
  redo: [];
  'switch-device': [device: DeviceType];
  'switch-mode': [mode: EditorMode];
  publish: [];
  save: [];
  'import-json': [];
  'export-json': [];
  'open-templates': [];
  'zoom-change': [zoom: number];
}>();

const deviceOptions: { value: DeviceType; icon: string; label: string; width: number }[] = [
  { value: 'pc', icon: '🖥️', label: 'PC', width: 0 },
  { value: 'tablet', icon: '📋', label: 'iPad', width: 768 },
  { value: 'mobile', icon: '📱', label: 'H5', width: 375 },
];

function onZoomDelta(delta: number) {
  const next = Math.min(200, Math.max(50, props.zoom + delta));
  emit('zoom-change', next);
}
</script>

<template>
  <div class="lb-toolbar">
    <!-- 顶部工具栏 -->
    <div class="lb-toolbar__top">
      <!-- 撤销/重做 -->
      <div class="lb-toolbar__group">
        <button
          class="lb-toolbar__btn"
          :disabled="!canUndo"
          title="撤销 (Ctrl+Z)"
          @click="emit('undo')"
        >
          ↶
        </button>
        <button
          class="lb-toolbar__btn"
          :disabled="!canRedo"
          title="重做 (Ctrl+Shift+Z)"
          @click="emit('redo')"
        >
          ↷
        </button>
      </div>

      <div class="lb-toolbar__divider" />

      <!-- 设备切换 -->
      <div class="lb-toolbar__group">
        <button
          v-for="opt in deviceOptions"
          :key="opt.value"
          class="lb-toolbar__btn lb-toolbar__btn--icon"
          :class="{ 'lb-toolbar__btn--active': device === opt.value }"
          :title="opt.label"
          @click="emit('switch-device', opt.value)"
        >
          {{ opt.icon }}
        </button>
      </div>

      <div class="lb-toolbar__divider" />

      <!-- 编辑模式 -->
      <div class="lb-toolbar__group">
        <button
          class="lb-toolbar__btn lb-toolbar__btn--text"
          :class="{ 'lb-toolbar__btn--active': mode === 'design' }"
          @click="emit('switch-mode', 'design')"
        >
          设计
        </button>
        <button
          class="lb-toolbar__btn lb-toolbar__btn--text"
          :class="{ 'lb-toolbar__btn--active': mode === 'preview' }"
          title="预览模式（模拟访客视角）"
          @click="emit('switch-mode', 'preview')"
        >
          👁 预览
        </button>
        <button
          class="lb-toolbar__btn lb-toolbar__btn--text"
          :class="{ 'lb-toolbar__btn--active': mode === 'code' }"
          title="JSON 代码编辑"
          @click="emit('switch-mode', 'code')"
        >
          { } 代码
        </button>
      </div>

      <div class="lb-toolbar__spacer" />

      <!-- 缩放控制 -->
      <div v-if="mode === 'design'" class="lb-toolbar__group lb-toolbar__zoom">
        <button class="lb-toolbar__btn lb-toolbar__btn--sm" title="缩小" @click="onZoomDelta(-10)">−</button>
        <span class="lb-toolbar__zoom-value">{{ zoom }}%</span>
        <button class="lb-toolbar__btn lb-toolbar__btn--sm" title="放大" @click="onZoomDelta(10)">+</button>
        <button v-if="zoom !== 100" class="lb-toolbar__btn lb-toolbar__btn--sm" title="重置" @click="emit('zoom-change', 100)">⟲</button>
      </div>

      <div class="lb-toolbar__divider" />

      <!-- 导入/导出/模板 -->
      <div class="lb-toolbar__group">
        <button class="lb-toolbar__btn lb-toolbar__btn--text" title="导入 JSON" @click="emit('import-json')">📥</button>
        <button class="lb-toolbar__btn lb-toolbar__btn--text" title="导出 JSON" @click="emit('export-json')">📤</button>
        <button class="lb-toolbar__btn lb-toolbar__btn--text" title="页面模板" @click="emit('open-templates')">📋 模板</button>
      </div>

      <div class="lb-toolbar__divider" />

      <!-- 协作状态 -->
      <div v-if="collabEnabled" class="lb-toolbar__collab">
        <span class="lb-toolbar__collab-dot" :class="{ 'lb-toolbar__collab-dot--online': onlineUsers.length > 0 }" />
        <span v-if="onlineUsers.length > 0" class="lb-toolbar__collab-text">{{ onlineUsers.length }} 人在线</span>
        <span v-else class="lb-toolbar__collab-text">单人</span>
      </div>

      <div class="lb-toolbar__divider" />

      <!-- 保存/发布 -->
      <div class="lb-toolbar__group">
        <button
          class="lb-toolbar__btn lb-toolbar__btn--text"
          :disabled="saving"
          @click="emit('save')"
        >
          {{ saving ? '保存中...' : '保存' }}
        </button>
        <button
          class="lb-toolbar__btn lb-toolbar__btn--primary"
          :disabled="saving"
          @click="emit('publish')"
        >
          🚀 发布
        </button>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="lb-toolbar__status">
      <div class="lb-toolbar__status-left">
        <span v-if="hasUnsavedChanges" class="lb-toolbar__status-unsaved">● 未保存</span>
        <span v-if="lastSavedAt" class="lb-toolbar__status-saved">上次保存 {{ lastSavedAt }}</span>
        <span v-if="version != null" class="lb-toolbar__status-version">v{{ version }}</span>
      </div>
      <div class="lb-toolbar__status-right">
        <span v-if="onlineUsers.length > 0" class="lb-toolbar__status-users">
          在线: {{ onlineUsers.join(', ') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lb-toolbar {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
}
.lb-toolbar__top {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  height: 44px;
}
.lb-toolbar__group {
  display: flex;
  align-items: center;
  gap: 2px;
}
.lb-toolbar__divider {
  width: 1px;
  height: 20px;
  background: #e8e8e8;
  margin: 0 4px;
}
.lb-toolbar__spacer {
  flex: 1;
}
.lb-toolbar__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 30px;
  padding: 0 8px;
  border: none;
  background: transparent;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  color: #606266;
  transition: all 0.15s ease;
  user-select: none;
}
.lb-toolbar__btn:hover:not(:disabled) {
  background: #f0f2f5;
  color: #303133;
}
.lb-toolbar__btn:active:not(:disabled) {
  transform: scale(0.95);
}
.lb-toolbar__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.lb-toolbar__btn--active {
  background: #ecf5ff;
  color: #409eff;
}
.lb-toolbar__btn--text {
  font-size: 13px;
  padding: 0 10px;
}
.lb-toolbar__btn--icon {
  font-size: 16px;
}
.lb-toolbar__btn--sm {
  min-width: 26px;
  height: 26px;
  font-size: 14px;
}
.lb-toolbar__btn--primary {
  background: #409eff;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  padding: 0 16px;
}
.lb-toolbar__btn--primary:hover:not(:disabled) {
  background: #66b1ff;
}
.lb-toolbar__zoom {
  gap: 4px;
}
.lb-toolbar__zoom-value {
  font-size: 12px;
  color: #909399;
  min-width: 36px;
  text-align: center;
}
.lb-toolbar__collab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 6px;
}
.lb-toolbar__collab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c0c4cc;
  transition: background 0.2s;
}
.lb-toolbar__collab-dot--online {
  background: #67c23a;
  box-shadow: 0 0 4px rgba(103, 194, 58, 0.5);
}
.lb-toolbar__collab-text {
  font-size: 12px;
  color: #909399;
}
/* 状态栏 */
.lb-toolbar__status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 28px;
  font-size: 11px;
  color: #909399;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}
.lb-toolbar__status-left,
.lb-toolbar__status-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.lb-toolbar__status-unsaved {
  color: #e6a23c;
}
.lb-toolbar__status-version {
  color: #409eff;
  font-weight: 500;
}
</style>
