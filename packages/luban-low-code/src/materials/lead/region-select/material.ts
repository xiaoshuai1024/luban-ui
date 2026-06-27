/**
 * LubanRegionSelect 物料定义（lead/region-select）。
 *
 * propsSchema 与 luban-base 的 LubanRegionSelect.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanRegionSelect } from 'luban-base';

export const regionSelectMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanRegionSelect',
  version: '1.0.0',
  category: 'lead',
  description: '省/市级联选择（留资表单控件）',
  component: LubanRegionSelect,
  propsSchema: {
    type: 'object',
    description: 'LubanRegionSelect 组件属性',
    properties: {
        modelValue: {
          type: "object",
          default: {},
          label: '值',
          description: '{province, city}',
        },
        label: {
          type: "string",
          default: "省/市",
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
