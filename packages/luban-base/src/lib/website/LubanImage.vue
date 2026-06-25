<script setup lang="ts">
type ObjectFit = 'cover' | 'contain' | 'fill' | 'none';
withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    objectFit?: ObjectFit;
    href?: string;
  }>(),
  { alt: '', objectFit: 'cover' },
);
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    class="lb-image"
    :style="{
      width:
        width == null
          ? '100%'
          : typeof width === 'number'
            ? `${width}px`
            : width,
      height:
        height == null
          ? undefined
          : typeof height === 'number'
            ? `${height}px`
            : height,
    }"
  >
    <img :src="src" :alt="alt" :style="{ objectFit }" />
  </component>
</template>

<style scoped>
.lb-image {
  display: block;
  overflow: hidden;
  border-radius: 4px;
}
.lb-image img {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
