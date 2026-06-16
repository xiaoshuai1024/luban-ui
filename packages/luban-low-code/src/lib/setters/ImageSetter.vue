<script setup lang="ts">
/**
 * 图片设置器（T-ui-d17）：URL 输入 + 预览 + 上传（FileReader 转 base64，零后端依赖）。
 * 适用于头像/海报图等小图；大图应配 OSS，由业务层接管（此处仅本地预览）。
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    /** 预览图宽度 */
    previewWidth?: number;
    /** 占位提示 */
    placeholder?: string;
  }>(),
  { modelValue: '', previewWidth: 80, placeholder: '输入图片 URL 或上传' }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const hasImage = computed(() => !!props.modelValue);

function onInput(e: Event): void {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}

function onFile(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    // 本地 base64 超过 2MB 不内嵌，提示用 URL
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    emit('update:modelValue', String(reader.result));
  };
  reader.readAsDataURL(file);
}

function clear(): void {
  emit('update:modelValue', '');
}
</script>

<template>
  <div class="lb-image-setter">
    <div class="lb-image-setter__input-row">
      <input
        class="lb-image-setter__input"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
      />
      <label class="lb-image-setter__upload" title="本地上传">
        📁
        <input type="file" accept="image/*" hidden @change="onFile" />
      </label>
      <button
        v-if="hasImage"
        class="lb-image-setter__clear"
        title="清除"
        @click="clear"
      >✕</button>
    </div>
    <div v-if="hasImage" class="lb-image-setter__preview">
      <img
        :src="modelValue"
        alt="预览"
        :style="{ maxWidth: `${previewWidth}px` }"
        @error="$emit('update:modelValue', modelValue)"
      />
      <span class="lb-image-setter__preview-label">预览</span>
    </div>
  </div>
</template>

<style scoped>
.lb-image-setter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lb-image-setter__input-row {
  display: flex;
  gap: 4px;
  align-items: center;
}
.lb-image-setter__input {
  flex: 1;
  height: 30px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 12px;
  min-width: 0;
}
.lb-image-setter__input:focus {
  border-color: #409eff;
  outline: none;
}
.lb-image-setter__upload {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
  transition: background 0.12s ease;
}
.lb-image-setter__upload:hover {
  background: #f0f2f5;
}
.lb-image-setter__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #fbc4c4;
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  flex-shrink: 0;
}
.lb-image-setter__preview {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
.lb-image-setter__preview img {
  max-height: 60px;
  border-radius: 3px;
  object-fit: contain;
}
.lb-image-setter__preview-label {
  font-size: 11px;
  color: #c0c4cc;
}
</style>
