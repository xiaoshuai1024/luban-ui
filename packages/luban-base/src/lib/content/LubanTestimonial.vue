<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** 评价引用 */
    quote: string;
    /** 作者姓名 */
    author?: string;
    /** 作者头衔/职务 */
    role?: string;
    /** 作者头像 URL */
    avatarUrl?: string;
    /** 评分（1-5），0 表示不显示 */
    rating?: number;
    /** 卡片背景色 */
    backgroundColor?: string;
  }>(),
  {
    author: '',
    role: '',
    avatarUrl: '',
    rating: 0,
    backgroundColor: '#ffffff',
  }
);

/** 评分夹紧到 [0,5] 区间（D15-E2 完善：防 rating 越界导致星数异常）。 */
const clampedRating = computed(() => {
  const r = Number(props.rating) || 0;
  if (r < 0) return 0;
  if (r > 5) return 5;
  return Math.floor(r);
});
</script>

<template>
  <div class="lb-testimonial" :style="{ backgroundColor }">
    <div v-if="clampedRating > 0" class="lb-testimonial__stars" :aria-label="`评分 ${clampedRating} / 5`">
      <span v-for="i in 5" :key="i" class="lb-testimonial__star" :class="{ 'lb-testimonial__star--active': i <= clampedRating }">★</span>
    </div>
    <blockquote class="lb-testimonial__quote">
      <p>{{ quote }}</p>
    </blockquote>
    <div class="lb-testimonial__author">
      <img v-if="avatarUrl" :src="avatarUrl" :alt="author" class="lb-testimonial__avatar" />
      <div class="lb-testimonial__author-info">
        <span v-if="author" class="lb-testimonial__author-name">{{ author }}</span>
        <span v-if="role" class="lb-testimonial__author-role">{{ role }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lb-testimonial {
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 100%;
}
.lb-testimonial__stars {
  margin-bottom: 12px;
}
.lb-testimonial__star {
  color: #ddd;
  font-size: 18px;
  &--active { color: #f59e0b; }
}
.lb-testimonial__quote {
  margin: 0 0 16px;
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  p { margin: 0; }
  &::before { content: '\201C'; font-size: 2em; color: #4361ee; line-height: 0; vertical-align: -0.4em; }
}
.lb-testimonial__author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.lb-testimonial__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}
.lb-testimonial__author-info {
  display: flex;
  flex-direction: column;
}
.lb-testimonial__author-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.9rem;
}
.lb-testimonial__author-role {
  font-size: 0.8rem;
  color: #6b7280;
}
</style>
