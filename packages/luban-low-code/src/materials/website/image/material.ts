/**
 * LubanImage 物料定义（website/image）。
 *
 * propsSchema 与 luban-base 的 LubanImage.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanImage } from 'luban-base';

export const imageMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanImage',
  version: '1.0.0',
  category: 'website',
  description: '图片，支持填充模式与链接跳转',
  component: LubanImage,
  propsSchema: {
    type: 'object',
    description: 'LubanImage 组件属性',
    properties: {
        src: {
          type: "string",
          default: "",
          label: '地址',
          description: '图片 URL（必填）',
        },
        alt: {
          type: "string",
          default: "",
          label: '替代文本',
          description: '图片 alt',
        },
        width: {
          type: "number|string",
          default: "",
          label: '宽度',
          description: '宽度 px 或 CSS 值',
        },
        height: {
          type: "number|string",
          default: "",
          label: '高度',
          description: '高度 px 或 CSS 值',
        },
        objectFit: {
          type: "string",
          enum: ["cover","contain","fill","none"],
          default: "cover",
          label: '填充',
          description: 'object-fit 填充模式',
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
  slots: [],
});
