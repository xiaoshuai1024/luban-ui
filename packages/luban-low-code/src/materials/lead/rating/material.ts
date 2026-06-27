/**
 * LubanRating 物料定义（lead/rating）。
 *
 * propsSchema 与 luban-base 的 LubanRating.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanRating } from 'luban-base';

export const ratingMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanRating',
  version: '1.0.0',
  category: 'lead',
  description: '评分控件（留资表单控件）',
  component: LubanRating,
  propsSchema: {
    type: 'object',
    description: 'LubanRating 组件属性',
    properties: {
        modelValue: {
          type: "number",
          default: 0,
          label: '值',
        },
        label: {
          type: "string",
          default: "评分",
          label: '标签',
        },
        name: {
          type: "string",
          default: "",
          label: '名称',
        },
        max: {
          type: "number",
          default: 5,
          label: '最大值',
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
