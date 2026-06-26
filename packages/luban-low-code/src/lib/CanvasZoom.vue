<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

/**
 * 画布缩放控制器（T-ui-d21）：
 * - 50%–200% 范围，步进 10%
 * - 按钮 +/- + 重置 + 下拉快捷选档
 * - Ctrl/⌘ + 滚轮缩放（绑定到 targetRef 指向的画布元素）
 * - 通过 transform: scale 应用（由父组件在画布 wrapper 上绑定）
 *
 * 缩放比例通过 v-model:zoom 双向同步。
 */
const props = withDefaults(
  defineProps<{
    zoom?: number;
    /** 最小缩放 */
    min?: number;
    /** 最大缩放 */
    max?: number;
    /** 步长 */
    step?: number;
    /** 绑定滚轮缩放的画布元素 ref（父组件传入） */
    target?: HTMLElement | null;
  }>(),
  { zoom: 100, min: 50, max: 200, step: 10, target: null },
);

const emit = defineEmits<{
  'update:zoom': [value: number];
}>();

const internal = ref(props.zoom);

watch(
  () => props.zoom,
  (val) => {
    internal.value = val;
  },
);

function clamp(val: number): number {
  return Math.max(props.min, Math.min(props.max, val));
}

function setZoom(val: number): void {
  const next = clamp(Math.round(val));
  if (next !== props.zoom) emit('update:zoom', next);
}

function delta(d: number): void {
  setZoom(props.zoom + d);
}

const PRESETS = [50, 75, 100, 125, 150, 200];

// Ctrl/⌘ + 滚轮缩放
function onWheel(e: WheelEvent): void {
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();
  const d = e.deltaY < 0 ? props.step : -props.step;
  delta(d);
}

onMounted(() => {
  if (props.target)
    props.target.addEventListener('wheel', onWheel, { passive: false });
});

watch(
  () => props.target,
  (el, oldEl) => {
    if (oldEl) oldEl.removeEventListener('wheel', onWheel);
    if (el) el.addEventListener('wheel', onWheel, { passive: false });
  },
);

onBeforeUnmount(() => {
  if (props.target) props.target.removeEventListener('wheel', onWheel);
});
</script>

<template>
  <div class="lb-canvas-zoom">
    <button
      class="lb-canvas-zoom__btn"
      title="缩小 (Ctrl/⌘ + −)"
      :disabled="zoom <= min"
      @click="delta(-step)"
    >
      −
    </button>

    <select
      v-model.number="internal"
      class="lb-canvas-zoom__select"
      title="缩放比例"
      @change="setZoom(internal)"
    >
      <option
        v-for="p in PRESETS"
        :key="p"
        :value="p"
      >
        {{ p }}%
      </option>
    </select>

    <button
      class="lb-canvas-zoom__btn"
      title="放大 (Ctrl/⌘ + +)"
      :disabled="zoom >= max"
      @click="delta(step)"
    >
      +
    </button>

    <button
      v-if="zoom !== 100"
      class="lb-canvas-zoom__reset"
      title="重置为 100%"
      @click="setZoom(100)"
    >
      ⟲
    </button>

    <span class="lb-canvas-zoom__hint">Ctrl + 滚轮</span>
  </div>
</template>

<style scoped>
.lb-canvas-zoom {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.lb-canvas-zoom__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  color: #606266;
  padding: 0;
  transition: all 0.12s ease;
}
.lb-canvas-zoom__btn:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}
.lb-canvas-zoom__btn:active:not(:disabled) {
  transform: scale(0.92);
}
.lb-canvas-zoom__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.lb-canvas-zoom__select {
  height: 26px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  color: #303133;
  cursor: pointer;
  padding: 0 4px;
}
.lb-canvas-zoom__select:focus {
  border-color: #409eff;
  outline: none;
}
.lb-canvas-zoom__reset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
}
.lb-canvas-zoom__reset:hover {
  border-color: #409eff;
  color: #409eff;
}
.lb-canvas-zoom__hint {
  font-size: 10px;
  color: #c0c4cc;
  margin-left: 4px;
  white-space: nowrap;
}
</style>
