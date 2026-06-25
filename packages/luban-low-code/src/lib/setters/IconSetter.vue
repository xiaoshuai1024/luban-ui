<script setup lang="ts">
/** IconSetter（T-ui-7）：预设 emoji 图标选择器 */
const PRESET_ICONS = ['📦','📝','🖼️','🔗','🔘','📋','⭐','🔔','📊','⚙️','🚀','💡','✅','❌','⚠️','🎯','🔥','💎','📱','💻']

withDefaults(defineProps<{ modelValue?: string }>(), { modelValue: '' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="lb-icon-setter">
    <div class="lb-icon-setter__grid">
      <button
        v-for="icon in PRESET_ICONS"
        :key="icon"
        class="lb-icon-setter__item"
        :class="{ 'lb-icon-setter__item--active': modelValue === icon }"
        type="button"
        @click="emit('update:modelValue', icon)"
      >{{ icon }}</button>
    </div>
    <input
      class="lb-icon-setter__input"
      type="text"
      :value="modelValue"
      placeholder="或输入自定义"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.lb-icon-setter { display: flex; flex-direction: column; gap: 6px; }
.lb-icon-setter__grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; }
.lb-icon-setter__item { border: 1px solid transparent; border-radius: 3px; background: #f5f7fa; cursor: pointer; font-size: 14px; padding: 2px; line-height: 1.5; }
.lb-icon-setter__item:hover { background: #ecf5ff; }
.lb-icon-setter__item--active { border-color: #409eff; background: #ecf5ff; }
.lb-icon-setter__input { width: 100%; padding: 4px 8px; border: 1px solid #dcdfe6; border-radius: 3px; font-size: 12px; outline: none; }
.lb-icon-setter__input:focus { border-color: #409eff; }
</style>
