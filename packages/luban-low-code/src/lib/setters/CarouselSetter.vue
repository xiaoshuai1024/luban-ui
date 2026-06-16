<script setup lang="ts">
/**
 * 轮播图可视化编辑器（T-ui-d18）：幻灯片列表增删改 + 拖拽排序 + 图片预览。
 * modelValue 为 CarouselSlide[]。
 */
import { computed } from 'vue';

export interface CarouselSlide {
  id?: string;
  image: string;
  title?: string;
  link?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: CarouselSlide[];
  }>(),
  { modelValue: () => [] }
);

const emit = defineEmits<{
  'update:modelValue': [value: CarouselSlide[]];
}>();

const slides = computed<CarouselSlide[]>(() => {
  return Array.isArray(props.modelValue) ? props.modelValue : [];
});

let _seq = 0;
function genId(): string {
  _seq++;
  return `slide-${Date.now().toString(36)}-${_seq}`;
}

function emitList(list: CarouselSlide[]): void {
  emit('update:modelValue', list.map((s) => ({ ...s })));
}

function add(): void {
  emitList([...slides.value, { id: genId(), image: '', title: '', link: '' }]);
}

function remove(index: number): void {
  emitList(slides.value.filter((_, i) => i !== index));
}

function update(index: number, patch: Partial<CarouselSlide>): void {
  emitList(slides.value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
}

function move(index: number, dir: -1 | 1): void {
  const target = index + dir;
  if (target < 0 || target >= slides.value.length) return;
  const list = [...slides.value];
  [list[index], list[target]] = [list[target], list[index]];
  emitList(list);
}
</script>

<template>
  <div class="lb-carousel-setter">
    <div class="lb-carousel-setter__list">
      <div
        v-for="(slide, i) in slides"
        :key="slide.id ?? i"
        class="lb-carousel-setter__item"
      >
        <div class="lb-carousel-setter__item-index">{{ i + 1 }}</div>
        <div class="lb-carousel-setter__item-body">
          <div class="lb-carousel-setter__row">
            <input
              class="lb-carousel-setter__input"
              type="text"
              :value="slide.image"
              placeholder="图片 URL"
              @input="update(i, { image: ($event.target as HTMLInputElement).value })"
            />
            <img
              v-if="slide.image"
              class="lb-carousel-setter__thumb"
              :src="slide.image"
              alt=""
            />
          </div>
          <input
            class="lb-carousel-setter__input"
            type="text"
            :value="slide.title"
            placeholder="标题（可选）"
            @input="update(i, { title: ($event.target as HTMLInputElement).value })"
          />
          <input
            class="lb-carousel-setter__input"
            type="text"
            :value="slide.link"
            placeholder="跳转链接（可选）"
            @input="update(i, { link: ($event.target as HTMLInputElement).value })"
          />
        </div>
        <div class="lb-carousel-setter__item-actions">
          <button title="上移" :disabled="i === 0" @click="move(i, -1)">↑</button>
          <button title="下移" :disabled="i === slides.length - 1" @click="move(i, 1)">↓</button>
          <button class="lb-carousel-setter__del" title="删除" @click="remove(i)">✕</button>
        </div>
      </div>
    </div>
    <button class="lb-carousel-setter__add" @click="add">+ 添加幻灯片</button>
    <p v-if="slides.length === 0" class="lb-carousel-setter__empty">暂无幻灯片，点击上方添加</p>
  </div>
</template>

<style scoped>
.lb-carousel-setter {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.lb-carousel-setter__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.lb-carousel-setter__item {
  display: flex;
  gap: 6px;
  padding: 8px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
.lb-carousel-setter__item-index {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lb-carousel-setter__item-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.lb-carousel-setter__row {
  display: flex;
  gap: 6px;
  align-items: center;
}
.lb-carousel-setter__input {
  flex: 1;
  height: 26px;
  padding: 0 6px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  font-size: 12px;
  min-width: 0;
}
.lb-carousel-setter__input:focus {
  border-color: #409eff;
  outline: none;
}
.lb-carousel-setter__thumb {
  width: 36px;
  height: 26px;
  object-fit: cover;
  border-radius: 3px;
  flex-shrink: 0;
}
.lb-carousel-setter__item-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.lb-carousel-setter__item-actions button {
  width: 22px;
  height: 22px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  color: #606266;
  padding: 0;
}
.lb-carousel-setter__item-actions button:hover:not(:disabled) {
  background: #ecf5ff;
  color: #409eff;
}
.lb-carousel-setter__item-actions button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.lb-carousel-setter__del:hover:not(:disabled) {
  background: #fef0f0 !important;
  color: #f56c6c !important;
}
.lb-carousel-setter__add {
  padding: 6px;
  border: 1px dashed #409eff;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.lb-carousel-setter__add:hover {
  background: #d9ecff;
}
.lb-carousel-setter__empty {
  text-align: center;
  font-size: 11px;
  color: #c0c4cc;
  margin: 0;
}
</style>
