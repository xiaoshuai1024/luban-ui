<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: '',
    label: '时间',
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
      type="time"
      :value="modelValue"
      :name="name"
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
