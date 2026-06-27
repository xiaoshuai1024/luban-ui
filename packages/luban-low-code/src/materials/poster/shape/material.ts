/**
 * LubanShape 物料定义（poster/shape）。
 *
 * propsSchema 与 luban-base 的 LubanShape.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanShape } from 'luban-base';

export const shapeMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanShape',
  version: '1.0.0',
  category: 'poster',
  description: '图形（矩形/圆形）',
  component: LubanShape,
  propsSchema: {
    type: 'object',
    description: 'LubanShape 组件属性',
    properties: {
        type: {
          type: "string",
          enum: ["rect","circle"],
          default: "rect",
          label: '形状',
        },
        color: {
          type: "string",
          default: "#1976d2",
          label: '颜色',
        },
        width: {
          type: "number",
          default: 200,
          label: '宽度',
        },
        height: {
          type: "number",
          default: 200,
          label: '高度',
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
