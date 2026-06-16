<script setup lang="ts">
/**
 * 间距设置器（T-ui-d17）：四向（上/右/下/左）间距输入 + 链锁统一值。
 * modelValue 为 { top, right, bottom, left } 或单一字符串（统一）。
 * 支持 px / rem / % 单位。
 */
import { computed } from 'vue';

interface Spacing {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: Spacing | string;
    /** 单位提示 */
    unit?: string;
  }>(),
  { modelValue: () => ({ top: '', right: '', bottom: '', left: '' }), unit: 'px' }
);

const emit = defineEmits<{
  'update:modelValue': [value: Spacing | string];
}>();

const spacing = computed<Spacing>(() => {
  const v = props.modelValue;
  if (typeof v === 'string') {
    return { top: v, right: v, bottom: v, left: v };
  }
  return { top: '', right: '', bottom: '', left: '', ...v };
});

const linked = computed(() => {
  const s = spacing.value;
  const vals = [s.top, s.right, s.bottom, s.left];
  const first = vals[0];
  return vals.every((x) => x === first);
});

function setSide(side: keyof Spacing, val: string): void {
  const next = { ...spacing.value, [side]: val };
  emit('update:modelValue', next);
}

function setAll(val: string): void {
  emit('update:modelValue', { top: val, right: val, bottom: val, left: val });
}
</script>

<template>
  <div class="lb-spacing-setter">
    <div class="lb-spacing-setter__grid">
      <div class="lb-spacing-setter__field lb-spacing-setter__field--top">
        <label>上</label>
        <input
          type="text"
          :value="spacing.top"
          :placeholder="`0${unit}`"
          @input="setSide('top', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="lb-spacing-setter__field lb-spacing-setter__field--right">
        <label>右</label>
        <input
          type="text"
          :value="spacing.right"
          :placeholder="`0${unit}`"
          @input="setSide('right', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="lb-spacing-setter__field lb-spacing-setter__field--bottom">
        <label>下</label>
        <input
          type="text"
          :value="spacing.bottom"
          :placeholder="`0${unit}`"
          @input="setSide('bottom', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="lb-spacing-setter__field lb-spacing-setter__field--left">
        <label>左</label>
        <input
          type="text"
          :value="spacing.left"
          :placeholder="`0${unit}`"
          @input="setSide('left', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="lb-spacing-setter__center" :class="{ 'lb-spacing-setter__center--linked': linked }">
        <span class="lb-spacing-setter__center-icon">{{ linked ? '🔗' : '⊡' }}</span>
      </div>
    </div>
    <div v-if="linked" class="lb-spacing-setter__all">
      <label>统一</label>
      <input
        type="text"
        :value="spacing.top"
        :placeholder="`0${unit}`"
        @input="setAll(($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<style scoped>
.lb-spacing-setter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lb-spacing-setter__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 4px;
  align-items: center;
}
.lb-spacing-setter__field {
  display: flex;
  align-items: center;
  gap: 4px;
}
.lb-spacing-setter__field label {
  font-size: 11px;
  color: #909399;
  width: 14px;
}
.lb-spacing-setter__field input {
  flex: 1;
  width: 100%;
  min-width: 0;
  height: 26px;
  padding: 0 6px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  font-size: 12px;
}
.lb-spacing-setter__field input:focus {
  border-color: #409eff;
  outline: none;
}
.lb-spacing-setter__field--top { grid-column: 2; grid-row: 1; }
.lb-spacing-setter__field--left { grid-column: 1; grid-row: 2; }
.lb-spacing-setter__center { grid-column: 2; grid-row: 2; text-align: center; }
.lb-spacing-setter__field--right { grid-column: 3; grid-row: 2; }
.lb-spacing-setter__field--bottom { grid-column: 2; grid-row: 3; }
.lb-spacing-setter__center-icon {
  font-size: 16px;
  color: #c0c4cc;
}
.lb-spacing-setter__center--linked .lb-spacing-setter__center-icon {
  color: #409eff;
}
.lb-spacing-setter__all {
  display: flex;
  align-items: center;
  gap: 6px;
}
.lb-spacing-setter__all label {
  font-size: 11px;
  color: #909399;
}
.lb-spacing-setter__all input {
  flex: 1;
  height: 26px;
  padding: 0 6px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  font-size: 12px;
}
.lb-spacing-setter__all input:focus {
  border-color: #409eff;
  outline: none;
}
</style>
