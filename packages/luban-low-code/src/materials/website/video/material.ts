/**
 * LubanVideo 物料定义（website/video）。
 *
 * propsSchema 与 luban-base 的 LubanVideo.vue defineProps 逐字段对齐（反漂移）。
 *
 * @since 0.1.0
 */

import type { MaterialDefinition } from '../../../lib/material/defineMaterial';
import { defineMaterial } from '../../../lib/material/defineMaterial';
import { LubanVideo } from 'luban-base';

export const videoMaterial: MaterialDefinition = defineMaterial({
  name: 'LubanVideo',
  version: '1.0.0',
  category: 'website',
  description: '视频播放器',
  component: LubanVideo,
  propsSchema: {
    type: 'object',
    description: 'LubanVideo 组件属性',
    properties: {
        src: {
          type: "string",
          default: "",
          label: '地址',
          description: '视频 URL（必填）',
        },
        poster: {
          type: "string",
          default: "",
          label: '封面',
          description: '封面图 URL',
        },
        controls: {
          type: "boolean",
          default: true,
          label: '控件',
          description: '是否显示控件',
        },
        width: {
          type: "number|string",
          default: "",
          label: '宽度',
          description: '宽度',
        },
    },
  },
  events: [],
  slots: [],
});
