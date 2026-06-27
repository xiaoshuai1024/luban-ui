/**
 * LubanDateRange 物料定义（form/date-range）。
 *
 * propsSchema 与 luban-base 的 LubanDateRange.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanDateRange } from 'luban-base';

export const dateRangeMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanDateRange',
  version: '1.0.0',
  category: 'form',
  description: '日期范围选择器',
  component: LubanDateRange,
  propsSchema: {
    type: 'object',
    description: 'LubanDateRange 组件属性',
    properties: {
        modelValue: {
          type: "object",
          default: {"start":"","end":""},
          label: '值',
          description: '{start, end}',
        },
        label: {
          type: "string",
          default: "日期范围",
          label: '标签',
        },
        name: {
          type: "string",
          default: "",
          label: '名称',
        },
        required: {
          type: "boolean",
          default: false,
          label: '必填',
        },
        disabled: {
          type: "boolean",
          default: false,
          label: '禁用',
        },
        error: {
          type: "boolean",
          default: false,
          label: '错误',
        },
        errorMessage: {
          type: "string",
          default: "",
          label: '错误提示',
        },
    },
  },
  events: [
    { name: 'update:modelValue', description: '值变更（v-model）' },
  ],
  slots: [],
});
