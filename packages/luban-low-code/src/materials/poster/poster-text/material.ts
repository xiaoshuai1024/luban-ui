/**
 * LubanPosterText 物料定义（poster/poster-text）。
 *
 * propsSchema 与 luban-base 的 LubanPosterText.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanPosterText } from 'luban-base';

export const posterTextMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanPosterText',
  version: '1.0.0',
  category: 'poster',
  description: '海报文本',
  component: LubanPosterText,
  propsSchema: {
    type: 'object',
    description: 'LubanPosterText 组件属性',
    properties: {
        content: {
          type: "string",
          default: "",
          label: '内容',
        },
        fontSize: {
          type: "number",
          default: 32,
          label: '字号',
        },
        color: {
          type: "string",
          default: "#333",
          label: '颜色',
        },
        align: {
          type: "string",
          enum: ["left","center","right"],
          default: "left",
          label: '对齐',
        },
        bold: {
          type: "boolean",
          default: false,
          label: '粗体',
        },
    },
  },
  events: [],
  slots: [],
});
