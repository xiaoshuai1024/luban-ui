/**
 * LubanQRCode 物料定义（poster/qr-code）。
 *
 * propsSchema 与 luban-base 的 LubanQRCode.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanQRCode } from 'luban-base';

export const qrCodeMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanQRCode',
  version: '1.0.0',
  category: 'poster',
  description: '二维码',
  component: LubanQRCode,
  propsSchema: {
    type: 'object',
    description: 'LubanQRCode 组件属性',
    properties: {
        value: {
          type: "string",
          default: "",
          label: '内容',
        },
        size: {
          type: "number",
          default: 160,
          label: '尺寸',
        },
    },
  },
  events: [],
  slots: [],
});
