/**
 * LubanDivider 物料定义（website/divider）。
 *
 * propsSchema 与 luban-base 的 LubanDivider.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanDivider } from 'luban-base';

export const dividerMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanDivider',
  version: '1.0.0',
  category: 'website',
  description: '分隔线，支持实线/虚线/点线',
  component: LubanDivider,
  propsSchema: {
    type: 'object',
    description: 'LubanDivider 组件属性',
    properties: {
        variant: {
          type: "string",
          enum: ["solid","dashed","dotted"],
          default: "solid",
          label: '样式',
          description: '线条样式',
        },
    },
  },
  events: [],
  slots: [],
});
