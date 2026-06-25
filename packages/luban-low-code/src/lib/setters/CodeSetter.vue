<script setup lang="ts">
/** CodeSetter（T-ui-7）：轻量代码编辑器（textarea + 行号） */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  language?: string
}>(), { modelValue: '', language: 'json' })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const lineCount = computed(() => props.modelValue.split('\n').length)
const lineNumbers = computed(() => Array.from({ length: lineCount.value }, (_, i) => i + 1).join('\n'))
</script>

<template>
  <div class="lb-code-setter">
    <pre class="lb-code-setter__lines">{{ lineNumbers }}</pre>
    <textarea
      class="lb-code-setter__textarea"
      :value="modelValue"
      rows="5"
      spellcheck="false"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>

<style scoped>
.lb-code-setter { display: flex; border: 1px solid #dcdfe6; border-radius: 3px; overflow: hidden; }
.lb-code-setter__lines { margin: 0; padding: 6px 8px; background: #f5f7fa; color: #909399; font-size: 11px; line-height: 1.5; font-family: ui-monospace, monospace; user-select: none; text-align: right; }
.lb-code-setter__textarea { flex: 1; border: none; outline: none; padding: 6px 8px; font-size: 12px; line-height: 1.5; font-family: ui-monospace, monospace; resize: vertical; background: #fff; color: #303133; }
</style>
