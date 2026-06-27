/**
 * LubanCarousel 物料定义（marketing/carousel）。
 *
 * propsSchema 与 luban-base 的 LubanCarousel.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanCarousel } from 'luban-base';

export const carouselMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanCarousel',
  version: '1.0.0',
  category: 'marketing',
  description: '轮播图',
  component: LubanCarousel,
  propsSchema: {
    type: 'object',
    description: 'LubanCarousel 组件属性',
    properties: {
        slides: {
          type: "array",
          default: [],
          label: '轮播项',
          description: '{src, alt, href}',
        },
        interval: {
          type: "number",
          default: 4000,
          label: '间隔',
          description: '自动切换间隔 ms',
        },
    },
  },
  events: [],
  slots: [],
});
