/**
 * LubanCoupon 物料定义（marketing/coupon）。
 *
 * propsSchema 与 luban-base 的 LubanCoupon.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanCoupon } from 'luban-base';

export const couponMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanCoupon',
  version: '1.0.0',
  category: 'marketing',
  description: '优惠券',
  component: LubanCoupon,
  propsSchema: {
    type: 'object',
    description: 'LubanCoupon 组件属性',
    properties: {
        code: {
          type: "string",
          default: "",
          label: '兑换码',
        },
        discount: {
          type: "string",
          default: "",
          label: '折扣',
        },
        title: {
          type: "string",
          default: "优惠券",
          label: '标题',
        },
        description: {
          type: "string",
          default: "",
          label: '描述',
        },
    },
  },
  events: [
    { name: 'copy', description: '复制兑换码（参数：code）' },
  ],
  slots: [],
});
