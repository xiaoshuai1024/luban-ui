<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: { start: string; end: string };
    label?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: () => ({ start: '', end: '' }),
    label: '日期范围',
    required: false,
    disabled: false,
    error: false,
  },
);
const emit = defineEmits<{
  'update:modelValue': [v: { start: string; end: string }];
}>();
</script>

<template>
  <div class="lb-form-field">
    <label
      v-if="label"
      class="lb-form-field__label"
      :class="{ 'lb-form-field__label--required': required }"
    >{{ label }}</label>
    <div class="lb-daterange">
      <input
        class="lb-input"
        :class="{ 'lb-input--error': error }"
        type="date"
        :value="modelValue.start"
        :disabled="disabled"
        :aria-invalid="error"
        @input="
          emit('update:modelValue', {
            ...modelValue,
            start: ($event.target as HTMLInputElement).value,
          })
        "
      >
      <span class="lb-daterange__sep">至</span>
      <input
        class="lb-input"
        :class="{ 'lb-input--error': error }"
        type="date"
        :value="modelValue.end"
        :disabled="disabled"
        :aria-invalid="error"
        @input="
          emit('update:modelValue', {
            ...modelValue,
            end: ($event.target as HTMLInputElement).value,
          })
        "
      >
    </div>
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
.lb-daterange {
  display: flex;
  align-items: center;
  gap: 8px;
}
.lb-daterange .lb-input {
  flex: 1;
}
.lb-daterange__sep {
  color: #999;
  font-size: 13px;
}
</style>
