<script setup lang="ts">
/**
 * 颜色设置器（T-ui-d17）：原生 color picker + 文本输入 + 透明度（可选）。
 * 支持十六进制 / rgb。预设色板快速取色。
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    /** 是否显示透明度滑块 */
    alpha?: boolean;
  }>(),
  { modelValue: '#000000', alpha: false }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const PRESETS = [
  '#000000', '#ffffff', '#f56c6c', '#e6a23c', '#67c23a', '#409eff', '#909399',
  '#f5222d', '#fa8c16', '#faad14', '#13c2c2', '#1677ff', '#722ed1', '#eb2f96',
];

const hexPart = computed(() => {
  const v = props.modelValue ?? '';
  // 取 hex 部分（#RRGGBB），忽略 alpha 后缀
  return v.startsWith('#') ? v.slice(0, 7) : '#000000';
});

function onSelect(e: Event): void {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}

function onText(e: Event): void {
  const val = (e.target as HTMLInputElement).value.trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(val) || val === '') {
    emit('update:modelValue', val);
  }
}
</script>

<template>
  <div class="lb-color-setter">
    <div class="lb-color-setter__main">
      <input
        class="lb-color-setter__picker"
        type="color"
        :value="hexPart"
        @input="onSelect"
      />
      <input
        class="lb-color-setter__text"
        type="text"
        :value="modelValue"
        placeholder="#000000"
        @change="onText"
      />
    </div>
    <div class="lb-color-setter__presets">
      <button
        v-for="c in PRESETS"
        :key="c"
        class="lb-color-setter__swatch"
        :style="{ background: c }"
        :title="c"
        :class="{ 'lb-color-setter__swatch--active': modelValue?.toLowerCase() === c }"
        @click="emit('update:modelValue', c)"
      />
    </div>
  </div>
</template>

<style scoped>
.lb-color-setter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lb-color-setter__main {
  display: flex;
  gap: 6px;
  align-items: center;
}
.lb-color-setter__picker {
  width: 32px;
  height: 30px;
  padding: 0;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}
.lb-color-setter__text {
  flex: 1;
  height: 30px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}
.lb-color-setter__text:focus {
  border-color: #409eff;
  outline: none;
}
.lb-color-setter__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.lb-color-setter__swatch {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s ease;
}
.lb-color-setter__swatch:hover {
  transform: scale(1.15);
}
.lb-color-setter__swatch--active {
  box-shadow: 0 0 0 2px #409eff;
}
</style>
