/**
 * LubanNavBar 物料定义（marketing/nav-bar）。
 *
 * propsSchema 与 luban-base 的 LubanNavBar.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanNavBar } from 'luban-base';

export const navBarMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanNavBar',
  version: '1.0.0',
  category: 'marketing',
  description: '顶部导航栏',
  component: LubanNavBar,
  propsSchema: {
    type: 'object',
    description: 'LubanNavBar 组件属性',
    properties: {
        brand: {
          type: "string",
          default: "Luban",
          label: '品牌名',
        },
        links: {
          type: "array",
          default: [],
          label: '导航链接',
          description: '{label, url}',
        },
        backgroundColor: {
          type: "string",
          default: "var(--lb-bg)",
          label: '背景色',
        },
        textColor: {
          type: "string",
          default: "var(--lb-bg-dark)",
          label: '文字色',
        },
        sticky: {
          type: "boolean",
          default: true,
          label: '吸顶',
        },
    },
  },
  events: [],
  slots: [],
});
