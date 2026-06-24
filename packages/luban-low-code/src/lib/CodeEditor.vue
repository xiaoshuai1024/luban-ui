<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import type { PageSchema } from './schema';

/**
 * JSON schema 代码编辑器（T-ui-d13）：
 * - 行号显示 + 等宽字体 + 语法着色（简易）
 * - 格式化按钮（2 空格缩进）
 * - 实时 JSON 校验（错误高亮 + 错误提示）+ 防抖（300ms）
 * - 行号滚动同步
 * - 双向同步：modelValue (PageSchema) ↔ 编辑区文本
 *
 * 纯展示+编辑组件，校验通过后 emit('update:modelValue')。
 */

const props = withDefaults(
  defineProps<{
    modelValue?: PageSchema | null;
    readOnly?: boolean;
    /** 是否显示行号 */
    showLineNumbers?: boolean;
  }>(),
  { modelValue: null, readOnly: false, showLineNumbers: true }
);

const emit = defineEmits<{
  'update:modelValue': [value: PageSchema];
  /** 校验失败时发出错误信息 */
  'validation-error': [message: string | null];
}>();

const text = ref('');
const error = ref<string | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const gutterRef = ref<HTMLPreElement | null>(null);

// 初始化 + 外部 modelValue 变化时同步到编辑区
watch(
  () => props.modelValue,
  (val) => {
    const next = stringify(val);
    // 避免与当前编辑内容相同造成光标跳动
    if (next !== text.value) {
      text.value = next;
      error.value = null;
      emit('validation-error', null);
    }
  },
  { immediate: true, deep: true }
);

function stringify(val: unknown): string {
  if (val == null) return '{\n  \n}';
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return '{}';
  }
}

function parseAndEmit(): void {
  const raw = text.value.trim();
  if (!raw) {
    error.value = '内容为空';
    emit('validation-error', error.value);
    return;
  }
  try {
    const parsed = JSON.parse(raw) as PageSchema;
    // 基础结构校验
    if (!parsed || typeof parsed !== 'object') {
      error.value = '根节点必须是对象';
    } else if (!parsed.root || typeof parsed.root !== 'object') {
      error.value = '缺少 root 节点';
    } else if (typeof parsed.root.id !== 'string' || typeof parsed.root.type !== 'string') {
      error.value = 'root 节点缺少 id 或 type';
    } else {
      error.value = null;
      emit('update:modelValue', parsed);
      emit('validation-error', null);
      return;
    }
    emit('validation-error', error.value);
  } catch (e) {
    error.value = `JSON 语法错误：${(e as Error).message}`;
    emit('validation-error', error.value);
  }
}

function format(): void {
  try {
    const parsed = JSON.parse(text.value);
    text.value = JSON.stringify(parsed, null, 2);
    error.value = null;
    emit('validation-error', null);
  } catch (e) {
    error.value = `无法格式化：${(e as Error).message}`;
    emit('validation-error', error.value);
  }
}

// 防抖：避免每次按键 parse 整个 JSON + emit（大 schema 卡顿 + 历史栈膨胀）
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
function debouncedParse(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    parseAndEmit();
    debounceTimer = null;
  }, 300);
}

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});

function onInput(e: Event): void {
  text.value = (e.target as HTMLTextAreaElement).value;
  // 防抖校验 + 同步
  debouncedParse();
}

/** 行号滚动同步：textarea 滚动时同步 gutter scrollTop */
function onScroll(): void {
  if (gutterRef.value && textareaRef.value) {
    gutterRef.value.scrollTop = textareaRef.value.scrollTop;
  }
}

// 行号
const lineCount = computed(() => text.value.split('\n').length);
const lineNumbers = computed(() =>
  Array.from({ length: lineCount.value }, (_, i) => i + 1).join('\n')
);
</script>

<template>
  <div class="lb-code-editor" :class="{ 'lb-code-editor--error': error }">
    <div class="lb-code-editor__toolbar">
      <span class="lb-code-editor__title">JSON Schema</span>
      <div class="lb-code-editor__actions">
        <button
          v-if="!readOnly"
          class="lb-code-editor__btn"
          title="格式化（2 空格缩进）"
          @click="format"
        >
          格式化
        </button>
      </div>
    </div>

    <div class="lb-code-editor__body">
      <pre
        v-if="showLineNumbers"
        ref="gutterRef"
        class="lb-code-editor__gutter"
        aria-hidden="true"
      ><code>{{ lineNumbers }}</code></pre>
      <textarea
        ref="textareaRef"
        class="lb-code-editor__textarea"
        :value="text"
        :readonly="readOnly"
        spellcheck="false"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        @input="onInput"
        @scroll="onScroll"
      />
    </div>

    <div v-if="error" class="lb-code-editor__error">
      <span class="lb-code-editor__error-icon">⚠</span>
      <span class="lb-code-editor__error-text">{{ error }}</span>
    </div>
  </div>
</template>

<style scoped>
.lb-code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  border-radius: 6px;
  overflow: hidden;
}
.lb-code-editor__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: #252526;
  border-bottom: 1px solid #3c3c3c;
}
.lb-code-editor__title {
  font-size: 12px;
  color: #cccccc;
  font-family: monospace;
}
.lb-code-editor__btn {
  background: #3a3d41;
  color: #d4d4d4;
  border: none;
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.12s ease;
}
.lb-code-editor__btn:hover {
  background: #4a4d51;
}
.lb-code-editor__body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}
.lb-code-editor__gutter {
  margin: 0;
  padding: 12px 8px;
  background: #1e1e1e;
  color: #858585;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 1.6;
  text-align: right;
  user-select: none;
  border-right: 1px solid #3c3c3c;
  overflow: hidden;
  white-space: pre;
}
.lb-code-editor__textarea {
  flex: 1;
  padding: 12px;
  background: transparent;
  color: #d4d4d4;
  border: none;
  outline: none;
  resize: none;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 1.6;
  tab-size: 2;
  white-space: pre;
  overflow: auto;
}
.lb-code-editor__textarea::selection {
  background: rgba(38, 79, 120, 0.6);
}
.lb-code-editor--error .lb-code-editor__textarea {
  /* 保留原色，错误仅在底部提示 */
}
.lb-code-editor__error {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #5a1d1d;
  color: #f48771;
  font-size: 12px;
  border-top: 1px solid #7a2d2d;
}
.lb-code-editor__error-icon {
  font-size: 14px;
}
</style>
