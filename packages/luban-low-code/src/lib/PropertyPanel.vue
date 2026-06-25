<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ComponentMeta, PropSchemaItem } from './componentMeta';

/**
 * 属性面板（重写 T-ui-d4）：消费 ComponentMeta.propSchema + styleSchema，
 * 按 type/setter 渲染编辑器，支持分组展示（基础/样式/事件）。
 * nodeMeta 为 null 时显示空态。
 */
const props = withDefaults(
  defineProps<{
    nodeMeta: ComponentMeta | null;
    modelValue?: Record<string, unknown>;
    styleValue?: Record<string, unknown>;
  }>(),
  {
    nodeMeta: null,
    modelValue: () => ({}),
    styleValue: () => ({}),
  }
);

const emit = defineEmits<{
  'update:modelValue': [patch: Record<string, unknown>];
  'update:styleValue': [patch: Record<string, unknown>];
}>();

const propEntries = computed(() => {
  if (!props.nodeMeta?.propSchema) return [];
  return Object.entries(props.nodeMeta.propSchema);
});

const styleEntries = computed(() => {
  if (!props.nodeMeta?.styleSchema) return [];
  return Object.entries(props.nodeMeta.styleSchema);
});

const eventsList = computed(() => props.nodeMeta?.events ?? []);

// T-ui-4：搜索 + 分组折叠
const searchQuery = ref('');
const COLLAPSE_KEY = 'luban_property_panel_collapsed';
const collapsed = ref<Record<string, boolean>>({});
try {
  const saved = localStorage.getItem(COLLAPSE_KEY);
  if (saved) collapsed.value = JSON.parse(saved);
} catch { /* noop */ }

function toggleGroup(group: string): void {
  collapsed.value = { ...collapsed.value, [group]: !collapsed.value[group] };
  try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsed.value)); } catch { /* noop */ }
}
function isCollapsed(group: string): boolean {
  return !!collapsed.value[group];
}

// 搜索时自动展开
watch(searchQuery, (q) => {
  if (q.trim()) collapsed.value = {};
});

// 过滤 propEntries
const filteredPropEntries = computed(() => {
  if (!searchQuery.value.trim()) return propEntries.value;
  const q = searchQuery.value.toLowerCase();
  return propEntries.value.filter(([key, schema]) =>
    (schema.label ?? key).toLowerCase().includes(q) || key.toLowerCase().includes(q)
  );
});
const filteredStyleEntries = computed(() => {
  if (!searchQuery.value.trim()) return styleEntries.value;
  const q = searchQuery.value.toLowerCase();
  return styleEntries.value.filter(([key, schema]) =>
    (schema.label ?? key).toLowerCase().includes(q) || key.toLowerCase().includes(q)
  );
});

/** 是否有任何可编辑字段（无则显示空态） */
const hasAnyField = computed(
  () => propEntries.value.length > 0 || styleEntries.value.length > 0 || eventsList.value.length > 0
);

function getValue(key: string, fallback: unknown, isStyle = false): unknown {
  const source = isStyle ? props.styleValue : props.modelValue;
  const v = source[key];
  return v !== undefined ? v : fallback;
}

function patch(key: string, value: unknown, isStyle = false): void {
  if (isStyle) {
    emit('update:styleValue', { [key]: value });
  } else {
    emit('update:modelValue', { [key]: value });
  }
}

function setterFor(schema: PropSchemaItem): string {
  return schema.setter ?? schema.type;
}

function jsonText(key: string, isStyle = false): string {
  const v = getValue(key, '', isStyle);
  try {
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
  } catch {
    return '';
  }
}

function commitJson(key: string, text: string, isStyle = false): void {
  try {
    patch(key, JSON.parse(text), isStyle);
  } catch {
    // parse failure
  }
}

function optionsList(key: string, isStyle = false): { label: string; value: string | number }[] {
  const v = getValue(key, [], isStyle);
  return Array.isArray(v) ? (v as { label: string; value: string | number }[]) : [];
}
function addOption(key: string, isStyle = false): void {
  patch(key, [...optionsList(key, isStyle), { label: '', value: '' }], isStyle);
}
function updateOption(key: string, index: number, field: 'label' | 'value', val: string, isStyle = false): void {
  const list = optionsList(key, isStyle).map((o, i) => (i === index ? { ...o, [field]: val } : o));
  patch(key, list, isStyle);
}
function removeOption(key: string, index: number, isStyle = false): void {
  patch(key, optionsList(key, isStyle).filter((_, i) => i !== index), isStyle);
}
</script>

<template>
  <div class="lb-property-panel">
    <template v-if="nodeMeta && hasAnyField">
      <div class="lb-property-panel__header">{{ nodeMeta.label }} 属性配置</div>

      <!-- T-ui-4：搜索框 -->
      <div class="lb-property-panel__search">
        <input
          v-model="searchQuery"
          class="lb-property-panel__search-input"
          type="text"
          placeholder="搜索属性..."
        />
      </div>

      <!-- 基础属性（可折叠） -->
      <div v-if="filteredPropEntries.length" class="lb-property-panel__section">
        <div class="lb-property-panel__section-title" @click="toggleGroup('基础')">
          <span class="lb-property-panel__arrow">{{ isCollapsed('基础') ? '▸' : '▾' }}</span>
          基础属性
        </div>
        <div v-show="!isCollapsed('基础')">
        <div v-for="([key, schema]) in filteredPropEntries" :key="'p-' + key" class="lb-property-field">
          <label class="lb-property-field__label" :class="{ 'lb-property-field__label--required': schema.required }">
            {{ schema.label ?? key }}
          </label>
          <input v-if="setterFor(schema) === 'string'" class="lb-property-input" type="text" :placeholder="schema.placeholder" :value="String(getValue(key, schema.default ?? ''))" @input="patch(key, ($event.target as HTMLInputElement).value)" />
          <input v-else-if="setterFor(schema) === 'number'" class="lb-property-input" type="number" :value="Number(getValue(key, schema.default ?? 0))" @input="patch(key, Number(($event.target as HTMLInputElement).value))" />
          <label v-else-if="setterFor(schema) === 'boolean'" class="lb-property-switch"><input type="checkbox" :checked="Boolean(getValue(key, schema.default ?? false))" @change="patch(key, ($event.target as HTMLInputElement).checked)" /><span>{{ Boolean(getValue(key, schema.default ?? false)) ? '是' : '否' }}</span></label>
          <select v-else-if="setterFor(schema) === 'select'" class="lb-property-input" :value="getValue(key, schema.default ?? '')" @change="patch(key, ($event.target as HTMLSelectElement).value)"><option v-for="opt in schema.options" :key="String(opt.value)" :value="opt.value">{{ opt.label }}</option></select>
          <div v-else-if="setterFor(schema) === 'color'" class="lb-property-color"><input type="color" class="lb-property-color__picker" :value="String(getValue(key, '#000000'))" @input="patch(key, ($event.target as HTMLInputElement).value)" /><input type="text" class="lb-property-input lb-property-color__text" :value="String(getValue(key, '#000000'))" @input="patch(key, ($event.target as HTMLInputElement).value)" /></div>
          <div v-else-if="setterFor(schema) === 'image'" class="lb-property-image"><input class="lb-property-input" type="text" placeholder="图片 URL" :value="String(getValue(key, ''))" @input="patch(key, ($event.target as HTMLInputElement).value)" /><img v-if="getValue(key, '')" class="lb-property-image__preview" :src="String(getValue(key, ''))" alt="预览" /></div>
          <textarea v-else-if="setterFor(schema) === 'json'" class="lb-property-textarea" :value="jsonText(key)" rows="4" @blur="commitJson(key, ($event.target as HTMLTextAreaElement).value)" />
          <div v-else-if="setterFor(schema) === 'options'" class="lb-property-options"><div v-for="(opt, i) in optionsList(key)" :key="i" class="lb-property-options__row"><input class="lb-property-input lb-property-options__input" type="text" placeholder="标签" :value="opt.label" @input="updateOption(key, i, 'label', ($event.target as HTMLInputElement).value)" /><input class="lb-property-input lb-property-options__input" type="text" placeholder="值" :value="String(opt.value)" @input="updateOption(key, i, 'value', ($event.target as HTMLInputElement).value)" /><button class="lb-property-options__btn" type="button" @click="removeOption(key, i)">✕</button></div><button class="lb-property-options__add" type="button" @click="addOption(key)">+ 添加</button></div>
          <textarea v-else class="lb-property-textarea" :value="jsonText(key)" rows="3" @blur="commitJson(key, ($event.target as HTMLTextAreaElement).value)" />
        </div>
        </div>
      </div>

      <!-- 样式属性（可折叠） -->
      <div v-if="filteredStyleEntries.length" class="lb-property-panel__section">
        <div class="lb-property-panel__section-title" @click="toggleGroup('样式')">
          <span class="lb-property-panel__arrow">{{ isCollapsed('样式') ? '▸' : '▾' }}</span>
          样式
        </div>
        <div v-show="!isCollapsed('样式')">
        <div v-for="([key, schema]) in filteredStyleEntries" :key="'s-' + key" class="lb-property-field">
          <label class="lb-property-field__label">{{ schema.label ?? key }}</label>
          <input v-if="setterFor(schema) === 'string' || setterFor(schema) === 'spacing'" class="lb-property-input" type="text" :placeholder="schema.placeholder ?? '如 16px'" :value="String(getValue(key, schema.default ?? '', true))" @input="patch(key, ($event.target as HTMLInputElement).value, true)" />
          <div v-else-if="setterFor(schema) === 'color'" class="lb-property-color"><input type="color" class="lb-property-color__picker" :value="String(getValue(key, '#000000', true))" @input="patch(key, ($event.target as HTMLInputElement).value, true)" /><input type="text" class="lb-property-input lb-property-color__text" :value="String(getValue(key, '#000000', true))" @input="patch(key, ($event.target as HTMLInputElement).value, true)" /></div>
          <select v-else-if="setterFor(schema) === 'select'" class="lb-property-input" :value="getValue(key, '', true)" @change="patch(key, ($event.target as HTMLSelectElement).value, true)"><option v-for="opt in schema.options" :key="String(opt.value)" :value="opt.value">{{ opt.label }}</option></select>
          <input v-else class="lb-property-input" type="text" :value="String(getValue(key, '', true))" @input="patch(key, ($event.target as HTMLInputElement).value, true)" />
        </div>
        </div>
      </div>

      <!-- 事件（可折叠） -->
      <div v-if="eventsList.length" class="lb-property-panel__section">
        <div class="lb-property-panel__section-title" @click="toggleGroup('事件')">
          <span class="lb-property-panel__arrow">{{ isCollapsed('事件') ? '▸' : '▾' }}</span>
          事件
        </div>
        <div v-show="!isCollapsed('事件')">
        <div v-for="evt in eventsList" :key="evt" class="lb-property-field">
          <label class="lb-property-field__label">{{ evt }}</label>
          <span class="lb-property-field__hint">可在代码模式绑定</span>
        </div>
        </div>
      </div>
    </template>

    <!-- 未选中 或 选中但无可编辑字段：空态 -->
    <div v-else class="lb-property-panel__empty">
      <div class="lb-property-panel__empty-icon">⚙️</div>
      <div>{{ nodeMeta ? '该组件暂无可编辑属性' : '选中组件后编辑属性' }}</div>
    </div>
  </div>
</template>

<style scoped>
.lb-property-panel{display:flex;flex-direction:column;height:100%;overflow-y:auto;background:#fff}
.lb-property-panel__header{font-weight:600;font-size:14px;padding:12px 16px 10px;border-bottom:1px solid #f0f0f0;color:#303133;position:sticky;top:0;background:#fff;z-index:1}
.lb-property-panel__section{padding:8px 16px;border-bottom:1px solid #f5f5f5}
.lb-property-panel__section-title{font-size:11px;color:#909399;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;margin-top:4px;cursor:pointer;user-select:none;display:flex;align-items:center;gap:4px}
.lb-property-panel__arrow{font-size:10px;color:#c0c4cc}
.lb-property-panel__search{padding:8px 12px}
.lb-property-panel__search-input{width:100%;padding:6px 10px;border:1px solid #dcdfe6;border-radius:6px;font-size:12px;outline:none}
.lb-property-panel__search-input:focus{border-color:#409eff}
.lb-property-field{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
.lb-property-field__label{font-size:12px;color:#606266}
.lb-property-field__label--required::after{content:' *';color:#f56c6c}
.lb-property-field__hint{font-size:11px;color:#c0c4cc}
.lb-property-input,.lb-property-textarea{width:100%;padding:6px 8px;border:1px solid #dcdfe6;border-radius:4px;font-size:13px;box-sizing:border-box;background:#fff;transition:border-color .15s}
.lb-property-input:focus,.lb-property-textarea:focus{outline:none;border-color:#409eff}
.lb-property-textarea{font-family:'SF Mono',Monaco,monospace;resize:vertical}
.lb-property-switch{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px}
.lb-property-color{display:flex;gap:4px;align-items:center}
.lb-property-color__picker{width:32px;height:30px;border:1px solid #dcdfe6;border-radius:4px;cursor:pointer;padding:2px}
.lb-property-color__text{flex:1}
.lb-property-image__preview{margin-top:4px;max-width:100%;max-height:80px;border-radius:4px;border:1px solid #eee}
.lb-property-options{display:flex;flex-direction:column;gap:6px}
.lb-property-options__row{display:flex;gap:4px;align-items:center}
.lb-property-options__input{flex:1;min-width:0}
.lb-property-options__btn{background:none;border:none;color:#f56c6c;cursor:pointer;padding:0 4px}
.lb-property-options__add{align-self:flex-start;background:none;border:1px dashed #dcdfe6;border-radius:4px;padding:4px 10px;color:#409eff;cursor:pointer;font-size:12px}
.lb-property-panel__empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;height:100%;color:#c0c4cc;font-size:13px}
.lb-property-panel__empty-icon{font-size:32px;opacity:.5}
</style>
