/**
 * LubanCountdown 物料定义（marketing/countdown）。
 *
 * propsSchema 与 luban-base 的 LubanCountdown.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanCountdown } from 'luban-base';

export const countdownMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanCountdown',
  version: '1.0.0',
  category: 'marketing',
  description: '倒计时',
  component: LubanCountdown,
  propsSchema: {
    type: 'object',
    description: 'LubanCountdown 组件属性',
    properties: {
        deadline: {
          type: "string",
          default: "",
          label: '截止时间',
        },
        label: {
          type: "string",
          default: "距离结束",
          label: '标签',
        },
    },
  },
  events: [],
  slots: [],
});
