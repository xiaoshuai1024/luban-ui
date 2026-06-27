<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { getPaletteGroups } from './palette';
import { getComponentMeta } from './componentMeta';
import { getComponentIcon } from './componentIcons';
import type { PaletteGroup, PaletteItem } from './palette';

/**
 * 组件面板（T-ui-d1）：左栏，搜索 + 分类折叠 + 拖拽源 + 最近使用。
 * 拖拽时设 dataTransfer('application/json', {type})，画布接收后 emit add-node。
 */
const emit = defineEmits<{
  'add-node': [type: string];
  'recent-change': [types: string[]];
}>();

const allGroups = computed<PaletteGroup[]>(() => getPaletteGroups());
const searchQuery = ref('');
const collapsed = ref<Record<string, boolean>>({});

// 最近使用（localStorage 持久化）
const STORAGE_KEY = 'luban_recent_components';
const recent = ref<string[]>([]);
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) recent.value = JSON.parse(saved);
} catch {
  /* ignore */
}

// 搜索过滤
const filteredGroups = computed<PaletteGroup[]>(() => {
  if (!searchQuery.value.trim()) return allGroups.value;
  const q = searchQuery.value.toLowerCase();
  return allGroups.value
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q),
      ),
    }))
    .filter((g) => g.items.length > 0);
});

// 搜索时展开所有分类
watch(searchQuery, (q) => {
  if (q.trim()) {
    // 搜索时展开所有
    collapsed.value = {};
  }
});

// 最近使用物料（解析为 PaletteItem）
const recentItems = computed<PaletteItem[]>(() => {
  return recent.value
    .slice(0, 6)
    .map((type) => {
      const meta = getComponentMeta(type);
      return { type, label: meta?.label ?? type };
    })
    .filter((item) => {
      // 搜索时也过滤最近使用
      if (!searchQuery.value.trim()) return true;
      const q = searchQuery.value.toLowerCase();
      return (
        item.label.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      );
    });
});

function toggleCategory(cat: string): void {
  collapsed.value[cat] = !collapsed.value[cat];
}

function isCollapsed(cat: string): boolean {
  return collapsed.value[cat] ?? false;
}

// 拖拽：设 dataTransfer
function onDragStart(e: DragEvent, type: string): void {
  if (e.dataTransfer) {
    e.dataTransfer.setData('application/json', JSON.stringify({ type }));
    e.dataTransfer.effectAllowed = 'copy';
  }
}

// 点击也支持添加（双击添加到画布）
function onDoubleClick(type: string): void {
  emit('add-node', type);
  addToRecent(type);
}

// 记录最近使用
function addToRecent(type: string): void {
  const idx = recent.value.indexOf(type);
  if (idx >= 0) recent.value.splice(idx, 1);
  recent.value.unshift(type);
  recent.value = recent.value.slice(0, 6);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.value));
  } catch {
    /* ignore */
  }
  emit('recent-change', recent.value);
}

// 暴露给父组件记录最近使用
defineExpose({ addToRecent });

// 获取物料图标：T-ui-6 改用 mini SVG（取代 emoji），提升专业度。
// meta.icon 仍保留作为命名提示，视觉以 SVG 为准。
function getIcon(type: string): string {
  return getComponentIcon(type);
}
</script>

<template>
  <div class="lb-component-panel">
    <!-- 搜索框 -->
    <div class="lb-component-panel__search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索组件..."
        class="lb-component-panel__search-input"
      >
    </div>

    <!-- 最近使用 -->
    <div
      v-if="recentItems.length"
      class="lb-component-panel__recent"
    >
      <div class="lb-component-panel__section-title">
        最近使用
      </div>
      <div class="lb-component-panel__items lb-component-panel__items--grid">
        <div
          v-for="item in recentItems"
          :key="'recent-' + item.type"
          class="lb-component-panel__item"
          draggable="true"
          :title="item.label"
          @dragstart="onDragStart($event, item.type)"
          @dblclick="onDoubleClick(item.type)"
        >
          <span class="lb-component-panel__icon" v-html="getIcon(item.type)"></span>
          <span class="lb-component-panel__label">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 分类列表 -->
    <div class="lb-component-panel__categories">
      <div
        v-for="group in filteredGroups"
        :key="group.category"
        class="lb-component-panel__category"
      >
        <div
          class="lb-component-panel__category-header"
          @click="toggleCategory(group.category)"
        >
          <span class="lb-component-panel__arrow">{{
            isCollapsed(group.category) ? '▸' : '▾'
          }}</span>
          <span>{{ group.category }}</span>
          <span class="lb-component-panel__count">{{
            group.items.length
          }}</span>
        </div>
        <transition name="lb-collapse">
          <div
            v-show="!isCollapsed(group.category)"
            class="lb-component-panel__items"
          >
            <div
              v-for="item in group.items"
              :key="item.type"
              class="lb-component-panel__item"
              draggable="true"
              :title="`拖拽或双击添加 ${item.label}`"
              @dragstart="onDragStart($event, item.type)"
              @dblclick="onDoubleClick(item.type)"
            >
              <span class="lb-component-panel__icon" v-html="getIcon(item.type)"></span>
              <span class="lb-component-panel__label">{{ item.label }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 搜索空结果 -->
    <div
      v-if="
        searchQuery.trim &&
          filteredGroups.length === 0 &&
          recentItems.length === 0
      "
      class="lb-component-panel__empty"
    >
      未找到匹配组件
    </div>
  </div>
</template>

<style scoped>
.lb-component-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #fff;
}
.lb-component-panel__search {
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.lb-component-panel__search-input {
  width: 100%;
  padding: 7px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.lb-component-panel__search-input:focus {
  border-color: #409eff;
}
.lb-component-panel__recent {
  padding: 8px 12px;
  border-bottom: 1px solid #f5f5f5;
  flex-shrink: 0;
}
.lb-component-panel__section-title {
  font-size: 11px;
  color: #909399;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.lb-component-panel__categories {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}
.lb-component-panel__category {
  margin-bottom: 2px;
}
.lb-component-panel__category-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  user-select: none;
  transition: background 0.15s;
}
.lb-component-panel__category-header:hover {
  background: #f5f7fa;
}
.lb-component-panel__arrow {
  font-size: 10px;
  color: #909399;
  width: 12px;
}
.lb-component-panel__count {
  margin-left: auto;
  font-size: 11px;
  color: #c0c4cc;
  background: #f0f0f0;
  padding: 1px 7px;
  border-radius: 10px;
}
.lb-component-panel__items {
  display: flex;
  flex-direction: column;
  padding: 2px 8px;
}
.lb-component-panel__items--grid {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
}
.lb-component-panel__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: grab;
  font-size: 13px;
  color: #606266;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}
.lb-component-panel__item:hover {
  background: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
}
.lb-component-panel__item:active {
  cursor: grabbing;
  transform: scale(0.97);
}
.lb-component-panel__items--grid .lb-component-panel__item {
  flex-direction: column;
  gap: 2px;
  padding: 8px 6px;
  min-width: 60px;
  text-align: center;
}
.lb-component-panel__icon {
  /* T-ui-6: SVG 缩略图（取代 emoji）；inline svg 以 18px 等比缩放，描边随 currentColor */
  width: 18px;
  height: 18px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.lb-component-panel__icon :deep(svg) {
  width: 18px;
  height: 18px;
  color: #606266;
}
.lb-component-panel__label {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lb-component-panel__empty {
  text-align: center;
  padding: 24px;
  color: #c0c4cc;
  font-size: 13px;
}

/* 折叠动画 */
.lb-collapse-enter-active,
.lb-collapse-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.lb-collapse-enter-from,
.lb-collapse-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
