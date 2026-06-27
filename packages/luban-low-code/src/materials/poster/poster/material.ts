/**
 * LubanPoster 物料定义（poster/poster）。
 *
 * propsSchema 与 luban-base 的 LubanPoster.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanPoster } from 'luban-base';

export const posterMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanPoster',
  version: '1.0.0',
  category: 'poster',
  description: '海报画布容器',
  component: LubanPoster,
  propsSchema: {
    type: 'object',
    description: 'LubanPoster 组件属性',
    properties: {
        width: {
          type: "number",
          default: 750,
          label: '宽度',
        },
        height: {
          type: "number",
          default: 1334,
          label: '高度',
        },
        background: {
          type: "string",
          default: "#fff",
          label: '背景',
        },
    },
  },
  events: [],
  slots: [
    { name: 'default', description: '默认插槽' },
  ],
});
