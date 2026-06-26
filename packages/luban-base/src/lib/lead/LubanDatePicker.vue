<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: '',
    label: '日期',
    placeholder: '请选择日期',
    required: false,
    disabled: false,
    error: false,
  },
);
const emit = defineEmits<{ 'update:modelValue': [v: string] }>();
</script>

<template>
  <div class="lb-form-field">
    <label
      v-if="label"
      class="lb-form-field__label"
      :class="{ 'lb-form-field__label--required': required }"
    >{{ label }}</label>
    <input
      class="lb-input"
      :class="{ 'lb-input--error': error }"
      type="date"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    >
    <p
      v-if="error && errorMessage"
      class="lb-form-field__error"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/form.scss';
</style>
