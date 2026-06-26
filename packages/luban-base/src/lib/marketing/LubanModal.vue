<script setup lang="ts">
const props = defineProps<{
  visible?: boolean;
  title?: string;
  trigger?: string;
}>();
const emit = defineEmits<{
  'update:visible': [v: boolean];
  open: [];
  close: [];
}>();
const open = () => {
  emit('update:visible', true);
  emit('open');
};
const close = () => {
  emit('update:visible', false);
  emit('close');
};
</script>

<template>
  <div class="lb-modal">
    <button
      v-if="trigger"
      class="lb-modal__trigger"
      type="button"
      @click="open"
    >
      {{ trigger }}
    </button>
    <teleport to="body">
      <div
        v-if="props.visible"
        class="lb-modal__mask"
        @click.self="close"
      >
        <div class="lb-modal__dialog">
          <div
            v-if="title"
            class="lb-modal__header"
          >
            <span>{{ title }}</span>
            <button
              class="lb-modal__close"
              type="button"
              @click="close"
            >
              ✕
            </button>
          </div>
          <div class="lb-modal__body">
            <slot />
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
.lb-modal__trigger {
  padding: 6px 16px;
  border: 1px solid #1976d2;
  background: #1976d2;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.lb-modal__mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.lb-modal__dialog {
  background: #fff;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
}
.lb-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  font-weight: 600;
}
.lb-modal__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #999;
}
.lb-modal__body {
  padding: 16px;
}
</style>
