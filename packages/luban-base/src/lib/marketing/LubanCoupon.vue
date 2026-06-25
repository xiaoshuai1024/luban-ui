<script setup lang="ts">
withDefaults(
  defineProps<{
    code: string;
    discount: string;
    title?: string;
    description?: string;
  }>(),
  { title: '优惠券', description: '' },
);
const emit = defineEmits<{ copy: [code: string] }>();
</script>

<template>
  <div class="lb-coupon">
    <div class="lb-coupon__left">
      <div class="lb-coupon__discount">
        {{ discount }}
      </div>
      <div class="lb-coupon__title">
        {{ title }}
      </div>
      <div v-if="description" class="lb-coupon__desc">
        {{ description }}
      </div>
    </div>
    <button class="lb-coupon__right" type="button" @click="emit('copy', code)">
      <span class="lb-coupon__code">{{ code }}</span>
      <span class="lb-coupon__action">复制</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.lb-coupon {
  display: flex;
  border: 1px dashed #e65100;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}
.lb-coupon__left {
  flex: 1;
  padding: 12px 16px;
  background: #fff8e1;
}
.lb-coupon__discount {
  font-size: 24px;
  font-weight: 700;
  color: #e65100;
}
.lb-coupon__title {
  font-size: 14px;
  color: #333;
  margin-top: 4px;
}
.lb-coupon__desc {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}
.lb-coupon__right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: #e65100;
  color: #fff;
  border: none;
  cursor: pointer;
  min-width: 90px;
}
.lb-coupon__code {
  font-size: 13px;
  font-weight: 600;
}
.lb-coupon__action {
  font-size: 11px;
  margin-top: 2px;
  opacity: 0.9;
}
</style>
