/**
 * LubanRichText 物料定义（website/rich-text）。
 *
 * propsSchema 与 luban-base 的 LubanRichText.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanRichText } from 'luban-base';

export const richTextMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanRichText',
  version: '1.0.0',
  category: 'website',
  description: '富文本，渲染 HTML 内容',
  component: LubanRichText,
  propsSchema: {
    type: 'object',
    description: 'LubanRichText 组件属性',
    properties: {
        html: {
          type: "string",
          default: "",
          label: 'HTML',
          description: 'HTML 内容（必填）',
        },
    },
  },
  events: [],
  slots: [],
});
