/**
 * LubanSlider 物料定义（lead/slider）。
 *
 * propsSchema 与 luban-base 的 LubanSlider.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanSlider } from 'luban-base';

export const sliderMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanSlider',
  version: '1.0.0',
  category: 'lead',
  description: '滑块（留资表单控件）',
  component: LubanSlider,
  propsSchema: {
    type: 'object',
    description: 'LubanSlider 组件属性',
    properties: {
        modelValue: {
          type: "number",
          default: 0,
          label: '值',
        },
        label: {
          type: "string",
          default: "滑块",
          label: '标签',
        },
        name: {
          type: "string",
          default: "",
          label: '名称',
        },
        min: {
          type: "number",
          default: 0,
          label: '最小值',
        },
        max: {
          type: "number",
          default: 100,
          label: '最大值',
        },
        step: {
          type: "number",
          default: 1,
          label: '步长',
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
