/**
 * LubanCollapse 物料定义（website/collapse）。
 *
 * propsSchema 与 luban-base 的 LubanCollapse.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanCollapse } from 'luban-base';

export const collapseMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanCollapse',
  version: '1.0.0',
  category: 'website',
  description: '折叠面板，多个面板标题/内容展开收起',
  component: LubanCollapse,
  propsSchema: {
    type: 'object',
    description: 'LubanCollapse 组件属性',
    properties: {
        panels: {
          type: "array",
          default: [],
          label: '面板',
          description: '面板数组 {title, content}',
        },
    },
  },
  events: [],
  slots: [],
});
