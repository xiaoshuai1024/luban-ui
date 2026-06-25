<script setup lang="ts">
/** EffectSetter（T-ui-7）：阴影/圆角/模糊效果面板 */
import ScrubInput from './ScrubInput.vue'

interface EffectValue { shadowX?: number; shadowY?: number; blur?: number; radius?: number }

const props = withDefaults(defineProps<{ modelValue?: EffectValue | string }>(), { modelValue: () => ({}) })
const emit = defineEmits<{ 'update:modelValue': [value: EffectValue] }>()

function getValue(): EffectValue {
  if (typeof props.modelValue === 'string') { try { return JSON.parse(props.modelValue) } catch { return {} } }
  return props.modelValue ?? {}
}
function update(field: keyof EffectValue, val: number): void {
  emit('update:modelValue', { ...getValue(), [field]: val })
}
</script>

<template>
  <div class="lb-effect-setter">
    <div class="lb-effect-setter__row"><span class="lb-effect-setter__label">阴影X</span><ScrubInput :model-value="getValue().shadowX ?? 0" unit="px" @update:model-value="update('shadowX', $event)" /></div>
    <div class="lb-effect-setter__row"><span class="lb-effect-setter__label">阴影Y</span><ScrubInput :model-value="getValue().shadowY ?? 0" unit="px" @update:model-value="update('shadowY', $event)" /></div>
    <div class="lb-effect-setter__row"><span class="lb-effect-setter__label">模糊</span><ScrubInput :model-value="getValue().blur ?? 0" unit="px" @update:model-value="update('blur', $event)" /></div>
    <div class="lb-effect-setter__row"><span class="lb-effect-setter__label">圆角</span><ScrubInput :model-value="getValue().radius ?? 0" unit="px" @update:model-value="update('radius', $event)" /></div>
  </div>
</template>

<style scoped>
.lb-effect-setter { display: flex; flex-direction: column; gap: 6px; }
.lb-effect-setter__row { display: flex; align-items: center; gap: 8px; }
.lb-effect-setter__label { font-size: 11px; color: #909399; min-width: 40px; }
</style>
