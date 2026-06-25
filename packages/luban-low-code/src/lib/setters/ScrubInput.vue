<script setup lang="ts">
/**
 * 数值拖动改值组件（T-ui-2）：Webflow 风格的「上下拖动改值」输入。
 *
 * hover 显示 ⇅ 手柄，按住上下拖改值；双击进入编辑模式。
 */
import { computed, nextTick, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number | string
    min?: number
    max?: number
    step?: number
    unit?: string
    label?: string
  }>(),
  { modelValue: 0, step: 1 }
)

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function toNumber(v: number | string | undefined): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (v == null || v === '') return 0
  const n = parseFloat(v)
  return Number.isNaN(n) ? 0 : n
}

function countDecimals(n: number): number {
  if (!Number.isFinite(n) || n === 0) return 0
  const s = String(n)
  const dot = s.indexOf('.')
  return dot < 0 ? 0 : s.length - dot - 1
}

function snap(n: number): number {
  const s = props.step > 0 ? props.step : 1
  return parseFloat((Math.round(n / s) * s).toFixed(countDecimals(s)))
}

function clamp(n: number): number {
  let v = n
  if (typeof props.min === 'number') v = Math.max(props.min, v)
  if (typeof props.max === 'number') v = Math.min(props.max, v)
  return v
}

function formatNum(n: number): string {
  if (!Number.isFinite(n)) return '0'
  return String(parseFloat(n.toFixed(countDecimals(props.step > 0 ? props.step : 1))))
}

const currentValue = ref<number>(clamp(snap(toNumber(props.modelValue))))
watch(() => props.modelValue, (v) => { if (!dragging.value) currentValue.value = clamp(snap(toNumber(v))) })

const dragging = ref(false)
let startY = 0
let startVal = 0
const editing = ref(false)
const editValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const displayNum = computed(() => formatNum(currentValue.value))

function onPointerDown(e: PointerEvent): void {
  if (editing.value || e.button !== 0) return
  dragging.value = true
  startY = e.clientY
  startVal = currentValue.value
  try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) } catch { /* noop */ }
}

function onPointerMove(e: PointerEvent): void {
  if (!dragging.value) return
  const deltaY = e.clientY - startY
  const next = clamp(snap(startVal - deltaY * props.step))
  if (next !== currentValue.value) {
    currentValue.value = next
    emit('update:modelValue', next)
  }
}

function endDrag(e: PointerEvent): void {
  if (!dragging.value) return
  dragging.value = false
  try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId) } catch { /* noop */ }
}

async function onDblClick(): Promise<void> {
  if (dragging.value) return
  editing.value = true
  editValue.value = displayNum.value
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}

function commitEdit(): void {
  const n = parseFloat(editValue.value)
  if (!Number.isNaN(n)) {
    const v = clamp(snap(n))
    currentValue.value = v
    emit('update:modelValue', v)
  }
  editing.value = false
}

function onEditKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') { e.preventDefault(); commitEdit() }
  else if (e.key === 'Escape') { e.preventDefault; editing.value = false }
}
</script>

<template>
  <div
    class="lb-scrub-input"
    :class="{ 'lb-scrub-input--dragging': dragging, 'lb-scrub-input--editing': editing }"
    title="拖动改值，双击编辑"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
    @dblclick="onDblClick"
  >
    <span class="lb-scrub-input__handle" aria-hidden="true">⇅</span>
    <span v-if="label" class="lb-scrub-input__label">{{ label }}</span>
    <input
      v-if="editing"
      ref="inputRef"
      v-model="editValue"
      class="lb-scrub-input__input"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      @keydown="onEditKeydown"
      @blur="commitEdit"
    />
    <template v-else>
      <span class="lb-scrub-input__num">{{ displayNum }}</span>
      <span v-if="unit" class="lb-scrub-input__unit">{{ unit }}</span>
    </template>
  </div>
</template>

<style scoped>
.lb-scrub-input {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 6px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  background: #fff;
  font-size: 12px;
  user-select: none;
  cursor: ns-resize;
  transition: border-color 0.15s ease;
}
.lb-scrub-input:hover { border-color: #c0c4cc; }
.lb-scrub-input--dragging { border-color: #409eff; cursor: grabbing; }
.lb-scrub-input--editing { cursor: text; border-color: #409eff; }
.lb-scrub-input__handle {
  flex-shrink: 0;
  color: #c0c4cc;
  font-size: 11px;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.lb-scrub-input:hover .lb-scrub-input__handle,
.lb-scrub-input--dragging .lb-scrub-input__handle { opacity: 1; }
.lb-scrub-input__label { flex-shrink: 0; color: #909399; font-size: 11px; }
.lb-scrub-input__num {
  margin-left: auto;
  color: #303133;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-variant-numeric: tabular-nums;
}
.lb-scrub-input__unit { flex-shrink: 0; color: #909399; font-size: 11px; }
.lb-scrub-input__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  text-align: right;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: #303133;
}
.lb-scrub-input__input::-webkit-outer-spin-button,
.lb-scrub-input__input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.lb-scrub-input__input { -moz-appearance: textfield; }
</style>
