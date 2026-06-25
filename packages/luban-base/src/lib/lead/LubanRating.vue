<script setup lang="ts">
import { ref } from 'vue';
const props = withDefaults(
  defineProps<{
    modelValue?: number;
    label?: string;
    name?: string;
    max?: number;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: 0,
    label: '评分',
    max: 5,
    required: false,
    disabled: false,
    error: false,
  },
);
const emit = defineEmits<{ 'update:modelValue': [v: number] }>();
const hover = ref(0);
</script>

<template>
  <div class="lb-form-field">
    <label
      v-if="label"
      class="lb-form-field__label"
      :class="{ 'lb-form-field__label--required': required }"
      >{{ label }}</label
    >
    <div class="lb-rating" :aria-invalid="error">
      <button
        v-for="i in max"
        :key="i"
        type="button"
        class="lb-rating__star"
        :class="{ 'lb-rating__star--active': i <= (hover || modelValue) }"
        :disabled="disabled"
        @click="!disabled && emit('update:modelValue', i)"
        @mouseenter="!disabled && (hover = i)"
        @mouseleave="hover = 0"
      >
        ★
      </button>
    </div>
    <p v-if="error && errorMessage" class="lb-form-field__error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/form.scss';
.lb-rating {
  display: inline-flex;
  gap: 4px;
}
.lb-rating__star {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #ddd;
  padding: 0;
}
.lb-rating__star--active {
  color: #ffa726;
}
.lb-rating__star:disabled {
  cursor: not-allowed;
}
</style>
