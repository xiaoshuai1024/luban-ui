<script setup lang="ts">
import { computed } from 'vue';

/**
 * 操作历史面板（T-ui-d20）：useHistory 可视化。
 * 由于 useHistory 仅暴露 canUndo/canRedo + undo/redo（不暴露原始栈），
 * 本面板以「当前步号」形式呈现，支持点击跳转到历史状态。
 * PageEditor 需传入 undoCount / redoCount / currentStep（可从 history 派生）。
 */
const props = withDefaults(
  defineProps<{
    /** 可撤销步数（history.canUndo 对应的栈深度） */
    undoCount?: number;
    /** 可重做步数 */
    redoCount?: number;
    /** 最近操作标签列表（从旧到新），用于显示每步描述 */
    labels?: string[];
    /** 是否正在加载 */
    loading?: boolean;
  }>(),
  { undoCount: 0, redoCount: 0, labels: () => [], loading: false },
);

const emit = defineEmits<{
  /** 跳转到目标步（正数=向前 redo，负数=向后 undo） */
  jump: [delta: number];
  undo: [];
  redo: [];
}>();

/**
 * 构建时间线条目：
 * - undo 栈步（过去，delta 为负，越早越负）
 * - 当前步
 * - redo 栈步（未来，delta 为正）
 */
interface TimelineEntry {
  /** 相对当前的步号偏移：负=过去，0=当前，正=未来 */
  delta: number;
  label: string;
  type: 'past' | 'current' | 'future';
}

const timeline = computed<TimelineEntry[]>(() => {
  const entries: TimelineEntry[] = [];
  const pastLabels = props.labels.slice(0, props.undoCount);
  const futureLabels = props.labels.slice(props.undoCount + 1);

  // 过去步（undo 栈），从最旧到最近
  for (let i = 0; i < props.undoCount; i++) {
    entries.push({
      delta: -(props.undoCount - i),
      label: pastLabels[i] ?? `操作 ${i + 1}`,
      type: 'past',
    });
  }
  // 当前步
  entries.push({
    delta: 0,
    label: props.labels[props.undoCount] ?? '当前状态',
    type: 'current',
  });
  // 未来步（redo 栈）
  for (let i = 0; i < props.redoCount; i++) {
    entries.push({
      delta: i + 1,
      label: futureLabels[i] ?? `操作 ${props.undoCount + i + 2}`,
      type: 'future',
    });
  }
  return entries.reverse(); // 最新在上
});

function onJump(entry: TimelineEntry): void {
  if (entry.delta === 0) return;
  emit('jump', entry.delta);
}
</script>

<template>
  <div class="lb-history-panel">
    <div class="lb-history-panel__header">
      <span class="lb-history-panel__title">操作历史</span>
      <div class="lb-history-panel__quick">
        <button
          class="lb-history-panel__btn"
          :disabled="undoCount === 0"
          title="撤销 (Ctrl+Z)"
          @click="emit('undo')"
        >
          ↶ 撤销
        </button>
        <button
          class="lb-history-panel__btn"
          :disabled="redoCount === 0"
          title="重做 (Ctrl+Shift+Z)"
          @click="emit('redo')"
        >
          ↷ 重做
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="lb-history-panel__empty"
    >
      加载中...
    </div>
    <div
      v-else-if="timeline.length === 1"
      class="lb-history-panel__empty"
    >
      暂无历史操作
    </div>
    <ul
      v-else
      class="lb-history-panel__timeline"
    >
      <li
        v-for="entry in timeline"
        :key="entry.delta"
        class="lb-history-panel__entry"
        :class="`lb-history-panel__entry--${entry.type}`"
        :title="
          entry.delta === 0
            ? '当前状态'
            : entry.delta < 0
              ? '点击撤销到此步'
              : '点击重做到此步'
        "
        @click="onJump(entry)"
      >
        <span class="lb-history-panel__dot" />
        <span class="lb-history-panel__entry-label">{{ entry.label }}</span>
        <span
          v-if="entry.type === 'current'"
          class="lb-history-panel__current-tag"
        >当前</span>
      </li>
    </ul>

    <div class="lb-history-panel__footer">
      <span class="lb-history-panel__stat">
        可撤销 <strong>{{ undoCount }}</strong> 步
      </span>
      <span class="lb-history-panel__stat">
        可重做 <strong>{{ redoCount }}</strong> 步
      </span>
    </div>
  </div>
</template>

<style scoped>
.lb-history-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
.lb-history-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
}
.lb-history-panel__title {
  font-weight: 500;
  font-size: 13px;
  color: #303133;
}
.lb-history-panel__quick {
  display: flex;
  gap: 4px;
}
.lb-history-panel__btn {
  padding: 3px 8px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #606266;
}
.lb-history-panel__btn:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}
.lb-history-panel__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.lb-history-panel__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 13px;
}
.lb-history-panel__timeline {
  list-style: none;
  margin: 0;
  padding: 8px 12px;
  overflow-y: auto;
  flex: 1;
}
.lb-history-panel__entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.1s ease;
}
.lb-history-panel__entry::before {
  content: '';
  position: absolute;
  left: 7px;
  top: -8px;
  bottom: 50%;
  width: 1px;
  background: #dcdfe6;
}
.lb-history-panel__entry:first-child::before {
  display: none;
}
.lb-history-panel__entry:hover {
  background: #f5f7fa;
}
.lb-history-panel__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c0c4cc;
  flex-shrink: 0;
  border: 2px solid #fff;
  z-index: 1;
}
.lb-history-panel__entry--current .lb-history-panel__dot {
  background: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}
.lb-history-panel__entry--future .lb-history-panel__dot {
  background: #e6e6e6;
}
.lb-history-panel__entry-label {
  flex: 1;
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lb-history-panel__entry--current .lb-history-panel__entry-label {
  color: #303133;
  font-weight: 500;
}
.lb-history-panel__entry--future .lb-history-panel__entry-label {
  color: #c0c4cc;
}
.lb-history-panel__current-tag {
  font-size: 10px;
  background: #409eff;
  color: #fff;
  padding: 1px 6px;
  border-radius: 8px;
}
.lb-history-panel__footer {
  display: flex;
  justify-content: space-around;
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}
.lb-history-panel__stat {
  font-size: 11px;
  color: #909399;
}
.lb-history-panel__stat strong {
  color: #409eff;
}
</style>
