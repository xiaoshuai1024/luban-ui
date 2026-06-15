<script setup lang="ts">
import { ref } from 'vue';
interface Slide { src: string; alt?: string; href?: string }
const props = withDefaults(defineProps<{ slides: Slide[]; interval?: number }>(), { interval: 4000 });
const current = ref(0);
const prev = () => { current.value = (current.value - 1 + props.slides.length) % props.slides.length; };
const next = () => { current.value = (current.value + 1) % props.slides.length; };
</script>

<template>
  <div class="lb-carousel">
    <div class="lb-carousel__viewport">
      <component
        :is="props.slides[current]?.href ? 'a' : 'div'"
        :href="props.slides[current]?.href"
        class="lb-carousel__slide"
      >
        <img v-if="props.slides[current]" :src="props.slides[current].src" :alt="props.slides[current].alt" />
      </component>
    </div>
    <button v-if="props.slides.length > 1" class="lb-carousel__nav lb-carousel__nav--prev" type="button" @click="prev">‹</button>
    <button v-if="props.slides.length > 1" class="lb-carousel__nav lb-carousel__nav--next" type="button" @click="next">›</button>
    <div v-if="props.slides.length > 1" class="lb-carousel__dots">
      <button
        v-for="(_, i) in props.slides"
        :key="i"
        type="button"
        :class="['lb-carousel__dot', { 'lb-carousel__dot--active': i === current }]"
        @click="current = i"
      />
    </div>
  </div>
</template>

<style scoped>
.lb-carousel { position: relative; width: 100%; overflow: hidden; border-radius: 8px; }
.lb-carousel__viewport { width: 100%; }
.lb-carousel__slide { display: block; width: 100%; }
.lb-carousel__slide img { width: 100%; display: block; }
.lb-carousel__nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.4); color: #fff; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px; }
.lb-carousel__nav--prev { left: 8px; }
.lb-carousel__nav--next { right: 8px; }
.lb-carousel__dots { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
.lb-carousel__dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: rgba(255,255,255,0.5); cursor: pointer; }
.lb-carousel__dot--active { background: #fff; }
</style>
