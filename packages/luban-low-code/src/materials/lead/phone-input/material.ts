/**
 * LubanPhoneInput 物料定义（lead/phone-input）。
 *
 * propsSchema 与 luban-base 的 LubanPhoneInput.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanPhoneInput } from 'luban-base';

export const phoneInputMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanPhoneInput',
  version: '1.0.0',
  category: 'lead',
  description: '手机号输入框（留资表单控件）',
  component: LubanPhoneInput,
  propsSchema: {
    type: 'object',
    description: 'LubanPhoneInput 组件属性',
    properties: {
        modelValue: {
          type: "string",
          default: "",
          label: '值',
        },
        label: {
          type: "string",
          default: "手机号",
          label: '标签',
        },
        name: {
          type: "string",
          default: "",
          label: '名称',
        },
        placeholder: {
          type: "string",
          default: "请输入手机号",
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
