/**
 * LubanDatePicker 物料定义（lead/date-picker）。
 *
 * propsSchema 与 luban-base 的 LubanDatePicker.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanDatePicker } from 'luban-base';

export const datePickerMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanDatePicker',
  version: '1.0.0',
  category: 'lead',
  description: '日期选择器（留资表单控件）',
  component: LubanDatePicker,
  propsSchema: {
    type: 'object',
    description: 'LubanDatePicker 组件属性',
    properties: {
        modelValue: {
          type: "string",
          default: "",
          label: '值',
          description: '当前日期值（v-model）',
        },
        label: {
          type: "string",
          default: "日期",
          label: '标签',
        },
        name: {
          type: "string",
          default: "",
          label: '名称',
          description: '表单字段名',
        },
        placeholder: {
          type: "string",
          default: "请选择日期",
          label: '占位符',
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
