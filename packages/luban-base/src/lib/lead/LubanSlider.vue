<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: number;
    label?: string;
    name?: string;
    min?: number;
    max?: number;
    step?: number;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: 0,
    label: '滑块',
    min: 0,
    max: 100,
    step: 1,
    required: false,
    disabled: false,
    error: false,
  },
);
const emit = defineEmits<{ 'update:modelValue': [v: number] }>();
</script>

<template>
  <div class="lb-form-field">
    <label
      v-if="label"
      class="lb-form-field__label"
      :class="{ 'lb-form-field__label--required': required }"
    >
      {{ label }} <span class="lb-slider__value">{{ modelValue }}</span>
    </label>
    <input
      class="lb-slider"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :name="name"
      :disabled="disabled"
      :aria-invalid="error"
      @input="
        emit(
          'update:modelValue',
          Number(($event.target as HTMLInputElement).value),
        )
      "
    />
    <p v-if="error && errorMessage" class="lb-form-field__error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/form.scss';
.lb-slider {
  width: 100%;
}
.lb-slider__value {
  color: #1976d2;
  font-weight: 600;
  margin-left: 8px;
}
</style>
