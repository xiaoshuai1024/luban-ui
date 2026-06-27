/**
 * LubanTimePicker 物料定义（form/time-picker）。
 *
 * propsSchema 与 luban-base 的 LubanTimePicker.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanTimePicker } from 'luban-base';

export const timePickerMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanTimePicker',
  version: '1.0.0',
  category: 'form',
  description: '时间选择器',
  component: LubanTimePicker,
  propsSchema: {
    type: 'object',
    description: 'LubanTimePicker 组件属性',
    properties: {
        modelValue: {
          type: "string",
          default: "",
          label: '值',
        },
        label: {
          type: "string",
          default: "时间",
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
