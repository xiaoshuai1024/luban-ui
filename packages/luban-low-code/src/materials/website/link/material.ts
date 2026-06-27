/**
 * LubanLink 物料定义（website/link）。
 *
 * propsSchema 与 luban-base 的 LubanLink.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanLink } from 'luban-base';

export const linkMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanLink',
  version: '1.0.0',
  category: 'website',
  description: '超链接文本',
  component: LubanLink,
  propsSchema: {
    type: 'object',
    description: 'LubanLink 组件属性',
    properties: {
        href: {
          type: "string",
          default: "",
          label: '地址',
          description: '链接 URL（必填）',
        },
        text: {
          type: "string",
          default: "",
          label: '文案',
          description: '链接文本（必填）',
        },
        target: {
          type: "string",
          default: "",
          label: '打开方式',
          description: 'target 属性',
        },
    },
  },
  events: [],
  slots: [],
});
