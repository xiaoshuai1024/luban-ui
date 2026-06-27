/**
 * LubanPosterImage 物料定义（poster/poster-image）。
 *
 * propsSchema 与 luban-base 的 LubanPosterImage.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanPosterImage } from 'luban-base';

export const posterImageMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanPosterImage',
  version: '1.0.0',
  category: 'poster',
  description: '海报图片',
  component: LubanPosterImage,
  propsSchema: {
    type: 'object',
    description: 'LubanPosterImage 组件属性',
    properties: {
        src: {
          type: "string",
          default: "",
          label: '地址',
        },
        width: {
          type: "number",
          default: 0,
          label: '宽度',
        },
        radius: {
          type: "number",
          default: 0,
          label: '圆角',
        },
    },
  },
  events: [],
  slots: [],
});
