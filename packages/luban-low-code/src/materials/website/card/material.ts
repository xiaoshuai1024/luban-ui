/**
 * LubanCard 物料定义（website/card）。
 *
 * propsSchema 与 luban-base 的 LubanCard.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanCard } from 'luban-base';

export const cardMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanCard',
  version: '1.0.0',
  category: 'website',
  description: '卡片容器，支持标题、描述、配图与链接',
  component: LubanCard,
  propsSchema: {
    type: 'object',
    description: 'LubanCard 组件属性',
    properties: {
        title: {
          type: "string",
          default: "",
          label: '标题',
          description: '卡片标题',
        },
        description: {
          type: "string",
          default: "",
          label: '描述',
          description: '卡片描述文案',
        },
        src: {
          type: "string",
          default: "",
          label: '配图',
          description: '配图 URL',
        },
        href: {
          type: "string",
          default: "",
          label: '链接',
          description: '点击跳转链接',
        },
    },
  },
  events: [],
  slots: [
    { name: 'default', description: '默认插槽' },
  ],
});
