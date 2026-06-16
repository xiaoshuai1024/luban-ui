<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
interface Slide { src: string; alt?: string; href?: string }
const props = withDefaults(defineProps<{ slides: Slide[]; interval?: number }>(), { interval: 4000 });
const current = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

const slideCount = computed(() => props.slides.length);
const safeIndex = computed(() => (slideCount.value > 0 ? current.value % slideCount.value : 0));

const prev = () => { if (slideCount.value === 0) return; current.value = (current.value - 1 + slideCount.value) % slideCount.value; };
const next = () => { if (slideCount.value === 0) return; current.value = (current.value + 1) % slideCount.value; };

function startAutoplay() {
  stopAutoplay();
  if (slideCount.value > 1 && props.interval > 0) {
    timer = setInterval(next, props.interval);
  }
}
function stopAutoplay() { if (timer) { clearInterval(timer); timer = undefined; } }

onMounted(startAutoplay);
onUnmounted(stopAutoplay);
watch(() => props.interval, startAutoplay);
</script>

<template>
  <div class="lb-carousel" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
    <div v-if="slideCount > 0" class="lb-carousel__viewport">
      <component
        :is="props.slides[safeIndex]?.href ? 'a' : 'div'"
        :href="props.slides[safeIndex]?.href"
        class="lb-carousel__slide"
      >
        <img :src="props.slides[safeIndex].src" :alt="props.slides[safeIndex].alt" />
      </component>
    </div>
    <div v-else class="lb-carousel__placeholder">轮播图（请添加图片）</div>
    <button v-if="slideCount > 1" class="lb-carousel__nav lb-carousel__nav--prev" type="button" @click="prev">‹</button>
    <button v-if="slideCount > 1" class="lb-carousel__nav lb-carousel__nav--next" type="button" @click="next">›</button>
    <div v-if="slideCount > 1" class="lb-carousel__dots">
      <button
        v-for="(_, i) in props.slides"
        :key="i"
        type="button"
        :class="['lb-carousel__dot', { 'lb-carousel__dot--active': i === safeIndex }]"
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
