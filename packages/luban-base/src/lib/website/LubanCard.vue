<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  src?: string;
  href?: string;
}>();
</script>

<template>
  <component :is="href ? 'a' : 'div'" :href="href" class="lb-card">
    <img v-if="src" class="lb-card__img" :src="src" />
    <div class="lb-card__body">
      <div v-if="title" class="lb-card__title">
        {{ title }}
      </div>
      <div v-if="description" class="lb-card__desc">
        {{ description }}
      </div>
      <slot />
    </div>
  </component>
</template>

<style scoped>
.lb-card {
  display: block;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s;
}
.lb-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.lb-card__img {
  width: 100%;
  display: block;
  aspect-ratio: 16/9;
  object-fit: cover;
}
.lb-card__body {
  padding: 12px 16px;
}
.lb-card__title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}
.lb-card__desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}
</style>
