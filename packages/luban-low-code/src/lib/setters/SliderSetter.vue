<script setup lang="ts">
/** SliderSetter（T-ui-7）：范围滑块 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: number
  min?: number
  max?: number
  step?: number
}>(), { modelValue: 0, min: 0, max: 100, step: 1 })

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const display = computed(() => String(props.modelValue))
</script>

<template>
  <div class="lb-slider-setter">
    <input
      type="range"
      class="lb-slider-setter__input"
      :min="min"
      :max="max"
      :step="step"
      :value="Number(modelValue)"
      @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    />
    <span class="lb-slider-setter__value">{{ display }}</span>
  </div>
</template>

<style scoped>
.lb-slider-setter { display: flex; align-items: center; gap: 8px; }
.lb-slider-setter__input { flex: 1; }
.lb-slider-setter__value { min-width: 30px; text-align: right; font-size: 12px; color: #303133; font-family: ui-monospace, monospace; }
</style>
