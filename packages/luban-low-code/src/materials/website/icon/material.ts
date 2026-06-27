/**
 * LubanIcon 物料定义（website/icon）。
 *
 * propsSchema 与 luban-base 的 LubanIcon.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanIcon } from 'luban-base';

export const iconMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanIcon',
  version: '1.0.0',
  category: 'website',
  description: '图标，按名称渲染内置图标',
  component: LubanIcon,
  propsSchema: {
    type: 'object',
    description: 'LubanIcon 组件属性',
    properties: {
        name: {
          type: "string",
          default: "",
          label: '名称',
          description: '图标名称（必填）',
        },
        size: {
          type: "number",
          default: 24,
          label: '尺寸',
          description: '图标尺寸 px',
        },
        color: {
          type: "string",
          default: "",
          label: '颜色',
          description: '图标颜色',
        },
    },
  },
  events: [],
  slots: [],
});
