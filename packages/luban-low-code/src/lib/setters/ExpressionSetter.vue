<script setup lang="ts">
/** ExpressionSetter（T-ui-7）：表达式输入（用 {{}} 插值） */
withDefaults(defineProps<{ modelValue?: string }>(), { modelValue: '' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="lb-expression-setter">
    <textarea
      class="lb-expression-setter__textarea"
      :value="modelValue"
      rows="2"
      placeholder="用 {{表达式}} 插值，如 {{user.name}}"
      spellcheck="false"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span class="lb-expression-setter__hint">支持 {{}} 插值表达式</span>
  </div>
</template>

<style scoped>
.lb-expression-setter { display: flex; flex-direction: column; gap: 4px; }
.lb-expression-setter__textarea { width: 100%; padding: 6px 8px; border: 1px solid #dcdfe6; border-radius: 3px; font-size: 12px; font-family: ui-monospace, monospace; outline: none; resize: vertical; }
.lb-expression-setter__textarea:focus { border-color: #409eff; }
.lb-expression-setter__hint { font-size: 10px; color: #c0c4cc; }
</style>
