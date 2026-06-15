<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentMeta } from './componentMeta';

/**
 * 属性面板（T-ui-1）：消费 ComponentMeta.propSchema，按类型动态生成编辑器。
 * 编辑值通过 update:modelValue 事件以 patch（{ [key]: value }）形式上抛。
 */
const props = withDefaults(
  defineProps<{
    nodeMeta: ComponentMeta;
    modelValue?: Record<string, unknown>;
  }>(),
  {
    modelValue: () => ({}),
  }
);

const emit = defineEmits<{
  'update:modelValue': [patch: Record<string, unknown>];
}>();

const entries = computed(() => Object.entries(props.nodeMeta.propSchema));

function patch(key: string, value: unknown): void {
  emit('update:modelValue', { [key]: value });
}

function onStringInput(key: string, e: Event): void {
  patch(key, (e.target as HTMLInputElement).value);
}

function onNumberInput(key: string, e: Event): void {
  patch(key, Number((e.target as HTMLInputElement).value));
}

function onBooleanChange(key: string, e: Event): void {
  patch(key, (e.target as HTMLInputElement).checked);
}

function onSelectChange(key: string, e: Event): void {
  patch(key, (e.target as HTMLSelectElement).value);
}

function getValue(key: string, fallback: unknown): unknown {
  const v = props.modelValue[key];
  return v !== undefined ? v : fallback;
}

// ---- json 编辑器辅助 ----
function jsonText(key: string): string {
  const v = getValue(key, '');
  try {
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
  } catch {
    return '';
  }
}

function commitJson(key: string, text: string): void {
  try {
    patch(key, JSON.parse(text));
  } catch {
    // 解析失败时不提交（保留用户编辑态）
  }
}

// ---- options 列表编辑器辅助 ----
function optionsList(key: string): { label: string; value: string | number }[] {
  const v = getValue(key, []);
  return Array.isArray(v) ? (v as { label: string; value: string | number }[]) : [];
}

function addOption(key: string): void {
  const list = [...optionsList(key), { label: '', value: '' }];
  patch(key, list);
}

function updateOption(key: string, index: number, field: 'label' | 'value', val: string): void {
  const list = optionsList(key).map((o, i) => (i === index ? { ...o, [field]: val } : o));
  patch(key, list);
}

function removeOption(key: string, index: number): void {
  const list = optionsList(key).filter((_, i) => i !== index);
  patch(key, list);
}
</script>

<template>
  <div class="lb-property-panel">
    <div class="lb-property-panel__header">{{ nodeMeta.label }} 属性</div>
    <div v-if="entries.length === 0" class="lb-property-panel__empty">无可配置属性</div>
    <div v-for="([key, schema]) in entries" :key="key" class="lb-property-field">
      <label class="lb-property-field__label" :class="{ 'lb-property-field__label--required': schema.required }">
        {{ schema.label ?? key }}
      </label>

      <!-- string -->
      <input
        v-if="schema.type === 'string'"
        class="lb-property-input"
        type="text"
        :value="String(getValue(key, schema.default ?? ''))"
        @input="onStringInput(key, $event)"
      />

      <!-- number -->
      <input
        v-else-if="schema.type === 'number'"
        class="lb-property-input"
        type="number"
        :value="Number(getValue(key, schema.default ?? 0))"
        @input="onNumberInput(key, $event)"
      />

      <!-- boolean -->
      <label v-else-if="schema.type === 'boolean'" class="lb-property-switch">
        <input
          type="checkbox"
          :checked="Boolean(getValue(key, schema.default ?? false))"
          @change="onBooleanChange(key, $event)"
        />
        <span>{{ Boolean(getValue(key, schema.default ?? false)) ? '开' : '关' }}</span>
      </label>

      <!-- select -->
      <select
        v-else-if="schema.type === 'select'"
        class="lb-property-input"
        :value="getValue(key, schema.default ?? '')"
        @change="onSelectChange(key, $event)"
      >
        <option v-for="opt in schema.options" :key="String(opt.value)" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <!-- json -->
      <textarea
        v-else-if="schema.type === 'json'"
        class="lb-property-textarea"
        :value="jsonText(key)"
        rows="4"
        @blur="commitJson(key, ($event.target as HTMLTextAreaElement).value)"
      ></textarea>

      <!-- options -->
      <div v-else-if="schema.type === 'options'" class="lb-property-options">
        <div v-for="(opt, i) in optionsList(key)" :key="i" class="lb-property-options__row">
          <input
            class="lb-property-input lb-property-options__input"
            type="text"
            placeholder="标签"
            :value="opt.label"
            @input="updateOption(key, i, 'label', ($event.target as HTMLInputElement).value)"
          />
          <input
            class="lb-property-input lb-property-options__input"
            type="text"
            placeholder="值"
            :value="String(opt.value)"
            @input="updateOption(key, i, 'value', ($event.target as HTMLInputElement).value)"
          />
          <button class="lb-property-options__btn" type="button" @click="removeOption(key, i)">✕</button>
        </div>
        <button class="lb-property-options__add" type="button" @click="addOption(key)">+ 添加选项</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lb-property-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  font-size: 13px;
  color: #333;
}
.lb-property-panel__header {
  font-weight: 600;
  font-size: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}
.lb-property-panel__empty {
  color: #999;
  padding: 8px 0;
}
.lb-property-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lb-property-field__label {
  font-size: 12px;
  color: #666;
}
.lb-property-field__label--required::after {
  content: ' *';
  color: #d32f2f;
}
.lb-property-input,
.lb-property-textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 13px;
  box-sizing: border-box;
  background: #fff;
}
.lb-property-input:focus,
.lb-property-textarea:focus {
  outline: none;
  border-color: #1976d2;
}
.lb-property-textarea {
  font-family: monospace;
  resize: vertical;
}
.lb-property-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.lb-property-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lb-property-options__row {
  display: flex;
  gap: 4px;
  align-items: center;
}
.lb-property-options__input {
  flex: 1;
  min-width: 0;
}
.lb-property-options__btn {
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
  padding: 0 4px;
}
.lb-property-options__add {
  align-self: flex-start;
  background: none;
  border: 1px dashed #bbb;
  border-radius: 4px;
  padding: 4px 10px;
  color: #1976d2;
  cursor: pointer;
  font-size: 12px;
}
</style>
