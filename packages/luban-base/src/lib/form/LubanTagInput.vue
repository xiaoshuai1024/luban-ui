<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    label?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: () => [],
    label: '标签',
    placeholder: '输入后回车添加',
    required: false,
    disabled: false,
    error: false,
  },
);
const emit = defineEmits<{ 'update:modelValue': [v: string[]] }>();
const input = ref('');
const tags = () => props.modelValue || [];
const addTag = () => {
  const v = input.value.trim();
  if (v && !props.disabled) {
    emit('update:modelValue', [...tags(), v]);
    input.value = '';
  }
};
const removeTag = (i: number) =>
  emit(
    'update:modelValue',
    tags().filter((_, idx) => idx !== i),
  );
</script>

<template>
  <div class="lb-form-field">
    <label
      v-if="label"
      class="lb-form-field__label"
      :class="{ 'lb-form-field__label--required': required }"
      >{{ label }}</label
    >
    <div class="lb-tag-input" :class="{ 'lb-tag-input--error': error }">
      <span v-for="(tag, i) in tags()" :key="i" class="lb-tag-input__tag">
        {{ tag }}
        <button
          v-if="!disabled"
          type="button"
          class="lb-tag-input__remove"
          @click="removeTag(i)"
        >
          ✕
        </button>
      </span>
      <input
        v-model="input"
        class="lb-tag-input__field"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-invalid="error"
        @keydown.enter.prevent="addTag"
      />
    </div>
    <p v-if="error && errorMessage" class="lb-form-field__error">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/form.scss';
.lb-tag-input {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 6px 8px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
}
.lb-tag-input--error {
  border-color: #d32f2f;
}
.lb-tag-input__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}
.lb-tag-input__remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #1976d2;
  padding: 0;
  font-size: 10px;
}
.lb-tag-input__field {
  flex: 1;
  min-width: 100px;
  border: none;
  outline: none;
  font-size: 13px;
}
</style>
