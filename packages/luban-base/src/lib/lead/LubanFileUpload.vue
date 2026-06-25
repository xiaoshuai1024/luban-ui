<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    name?: string;
    accept?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: '',
    label: '文件上传',
    accept: '',
    required: false,
    disabled: false,
    error: false,
  },
);
const emit = defineEmits<{ 'update:modelValue': [v: string] }>();
const onChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  emit('update:modelValue', input.files?.[0]?.name || '');
};
</script>

<template>
  <div class="lb-form-field">
    <label
      v-if="label"
      class="lb-form-field__label"
      :class="{ 'lb-form-field__label--required': required }"
      >{{ label }}</label
    >
    <input
      class="lb-input"
      :class="{ 'lb-input--error': error }"
      type="file"
      :accept="accept"
      :name="name"
      :disabled="disabled"
      :aria-invalid="error"
      @change="onChange"
    />
    <p v-if="error && errorMessage" class="lb-form-field__error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/form.scss';
</style>
