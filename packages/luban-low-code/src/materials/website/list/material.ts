/**
 * LubanList 物料定义（website/list）。
 *
 * propsSchema 与 luban-base 的 LubanList.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanList } from 'luban-base';

export const listMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanList',
  version: '1.0.0',
  category: 'website',
  description: '列表，有序或无序',
  component: LubanList,
  propsSchema: {
    type: 'object',
    description: 'LubanList 组件属性',
    properties: {
        items: {
          type: "array",
          default: [],
          label: '列表项',
          description: '列表项数组（必填）',
        },
        ordered: {
          type: "boolean",
          default: false,
          label: '有序',
          description: '是否有序列表',
        },
    },
  },
  events: [],
  slots: [],
});
