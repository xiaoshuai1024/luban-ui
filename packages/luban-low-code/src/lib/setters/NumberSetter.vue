<script setup lang="ts">
/** NumberSetter（T-ui-7）：包装 ScrubInput，从 schema 读 min/max/step/unit */
import { computed } from 'vue'
import ScrubInput from './ScrubInput.vue'

const props = withDefaults(defineProps<{
  modelValue?: number | string
  min?: number
  max?: number
  step?: number
  unit?: string
}>(), { modelValue: 0, step: 1 })

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const numValue = computed(() => typeof props.modelValue === 'number' ? props.modelValue : parseFloat(props.modelValue) || 0)
</script>

<template>
  <ScrubInput
    :model-value="numValue"
    :min="min"
    :max="max"
    :step="step"
    :unit="unit"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
