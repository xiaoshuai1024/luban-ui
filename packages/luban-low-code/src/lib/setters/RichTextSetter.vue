<script setup lang="ts">
/**
 * 轻量富文本设置器（T-ui-d17）：基于 contenteditable + document.execCommand。
 * 支持：加粗/斜体/下划线/删除线/链接/列表/对齐/清除格式。
 * modelValue 为 HTML 字符串。零依赖（不引入 TipTap/Quill，保持包轻量）。
 */
import { ref, onMounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
  }>(),
  { modelValue: '', placeholder: '输入富文本内容...' },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const editorRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (editorRef.value) editorRef.value.innerHTML = props.modelValue;
});

// 外部值变化时同步（避免覆盖正在编辑的光标位置：仅在失焦/值与内容不一致时）
watch(
  () => props.modelValue,
  (val) => {
    if (editorRef.value && document.activeElement !== editorRef.value) {
      if (editorRef.value.innerHTML !== val) editorRef.value.innerHTML = val;
    }
  },
);

function exec(command: string, value?: string): void {
  document.execCommand(command, false, value);
  editorRef.value?.focus();
  emitChange();
}

function setLink(): void {
  const url = window.prompt('输入链接地址（含 https://）');
  if (!url) return;
  // 校验 URL 合法性（避免无效 href 如纯中文）
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    exec('createLink', parsed.href);
  } catch {
    // 非法 URL，忽略
  }
}

function emitChange(): void {
  if (editorRef.value) emit('update:modelValue', editorRef.value.innerHTML);
}

const TOOLS: { cmd: string; icon: string; title: string; arg?: string }[] = [
  { cmd: 'bold', icon: 'B', title: '加粗' },
  { cmd: 'italic', icon: 'I', title: '斜体' },
  { cmd: 'underline', icon: 'U', title: '下划线' },
  { cmd: 'strikeThrough', icon: 'S', title: '删除线' },
  { cmd: 'insertUnorderedList', icon: '•', title: '无序列表' },
  { cmd: 'insertOrderedList', icon: '1.', title: '有序列表' },
  { cmd: 'justifyLeft', icon: '⇤', title: '左对齐' },
  { cmd: 'justifyCenter', icon: '≡', title: '居中' },
  { cmd: 'justifyRight', icon: '⇥', title: '右对齐' },
  { cmd: 'removeFormat', icon: '⊘', title: '清除格式' },
];
</script>

<template>
  <div class="lb-richtext-setter">
    <div class="lb-richtext-setter__toolbar">
      <button
        v-for="t in TOOLS"
        :key="t.cmd"
        class="lb-richtext-setter__btn"
        :title="t.title"
        @mousedown.prevent="exec(t.cmd, t.arg)"
      >
        {{ t.icon }}
      </button>
      <button
        class="lb-richtext-setter__btn"
        title="插入链接"
        @mousedown.prevent="setLink"
      >
        🔗
      </button>
    </div>
    <div
      ref="editorRef"
      class="lb-richtext-setter__editor"
      contenteditable="true"
      :data-placeholder="placeholder"
      @input="emitChange"
      @blur="emitChange"
    />
  </div>
</template>

<style scoped>
.lb-richtext-setter {
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.lb-richtext-setter__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 4px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.lb-richtext-setter__btn {
  min-width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  color: #606266;
  font-family: monospace;
  transition: background 0.1s ease;
}

.lb-richtext-setter__btn:hover {
  background: #ecf5ff;
  color: #409eff;
}

.lb-richtext-setter__editor {
  min-height: 80px;
  max-height: 200px;
  padding: 8px;
  font-size: 13px;
  line-height: 1.6;
  outline: none;
  overflow-y: auto;
}

.lb-richtext-setter__editor:empty::before {
  content: attr(data-placeholder);
  color: #c0c4cc;
}

.lb-richtext-setter__editor :deep(ul),
.lb-richtext-setter__editor :deep(ol) {
  padding-left: 20px;
  margin: 4px 0;
}

.lb-richtext-setter__editor :deep(a) {
  color: #409eff;
}
</style>
