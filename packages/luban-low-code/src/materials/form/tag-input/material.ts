/**
 * LubanTagInput 物料定义（form/tag-input）。
 *
 * propsSchema 与 luban-base 的 LubanTagInput.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanTagInput } from 'luban-base';

export const tagInputMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanTagInput',
  version: '1.0.0',
  category: 'form',
  description: '标签输入（回车添加）',
  component: LubanTagInput,
  propsSchema: {
    type: 'object',
    description: 'LubanTagInput 组件属性',
    properties: {
        modelValue: {
          type: "array",
          default: [],
          label: '值',
        },
        label: {
          type: "string",
          default: "标签",
          label: '标签',
        },
        name: {
          type: "string",
          default: "",
          label: '名称',
        },
        placeholder: {
          type: "string",
          default: "输入后回车添加",
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
