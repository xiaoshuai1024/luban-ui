/**
 * LubanHeading 物料定义（website/heading）。
 *
 * propsSchema 与 luban-base 的 LubanHeading.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanHeading } from 'luban-base';

export const headingMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanHeading',
  version: '1.0.0',
  category: 'website',
  description: '标题文本，支持 H1-H6 层级',
  component: LubanHeading,
  propsSchema: {
    type: 'object',
    description: 'LubanHeading 组件属性',
    properties: {
        level: {
          type: "number",
          enum: [1,2,3,4,5,6],
          default: 2,
          label: '层级',
          description: '标题层级 1-6',
        },
        content: {
          type: "string",
          default: "",
          label: '内容',
          description: '标题文本',
        },
    },
  },
  events: [],
  slots: [],
});
