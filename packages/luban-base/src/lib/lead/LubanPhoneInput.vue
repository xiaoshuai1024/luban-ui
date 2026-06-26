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
    label: '手机号',
    placeholder: '请输入手机号',
    required: false,
    disabled: false,
    error: false,
  },
);
const emit = defineEmits<{ 'update:modelValue': [v: string] }>();
// 简单格式化：3-4-4 分段
const onInput = (e: Event) => {
  const raw = (e.target as HTMLInputElement).value
    .replace(/\D/g, '')
    .slice(0, 11);
  let formatted = raw;
  if (raw.length > 7)
    formatted = `${raw.slice(0, 3)} ${raw.slice(3, 7)} ${raw.slice(7)}`;
  else if (raw.length > 3) formatted = `${raw.slice(0, 3)} ${raw.slice(3)}`;
  emit('update:modelValue', raw);
  (e.target as HTMLInputElement).value = formatted;
};
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
      type="tel"
      inputmode="numeric"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error"
      @input="onInput"
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
