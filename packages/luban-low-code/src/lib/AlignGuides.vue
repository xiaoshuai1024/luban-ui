<script setup lang="ts">
import { computed } from 'vue';

/**
 * 对齐辅助线（T-ui-d12）：在多选/拖拽场景下显示同级节点的边缘对齐线 + 吸附。
 *
 * ⚠️ 接线状态：当前 DesignRenderer 使用 Sortable（流式布局），非自由定位，
 * 故本组件暂未自动接入。海报模式（绝对定位）启用后，需由宿主计算
 * 选中节点 + 同级节点的 DOM rect（相对画布坐标）传入 active/siblings。
 * 组件本身逻辑完整（SVG 辅助线 + 边缘/中线吸附 + 间距标注），可安全消费。
 *
 * 纯展示组件：接收 nodes（选中节点的 DOM rects，相对画布坐标），
 * 渲染水平/垂直辅助线 + 间距标注。吸附阈值由 props.threshold 控制。
 */

export interface AlignRect {
  /** 节点 id（可选，用于调试） */
  id?: string;
  /** 相对画布的 x（左边缘） */
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GuideLine {
  type: 'horizontal' | 'vertical';
  /** 线的位置：水平线为 y，垂直线为 x */
  pos: number;
  /** 线的起止范围 */
  start: number;
  end: number;
}

const props = withDefaults(
  defineProps<{
    /** 被拖拽/参考的节点（其 rect） */
    active?: AlignRect | null;
    /** 同级其他节点 rects（用于对齐参考） */
    siblings?: AlignRect[];
    /** 画布宽度（用于计算线的起止） */
    canvasWidth?: number;
    canvasHeight?: number;
    /** 吸附阈值（px），默认 4 */
    threshold?: number;
    /** 是否吸附到画布中线 */
    snapToCanvasCenter?: boolean;
  }>(),
  {
    active: null,
    siblings: () => [],
    canvasWidth: 1200,
    canvasHeight: 800,
    threshold: 4,
    snapToCanvasCenter: true,
  }
);

// 计算对齐线：active rect 的边缘/中线 与 siblings 边缘/中线 比较
const guides = computed<GuideLine[]>(() => {
  const lines: GuideLine[] = [];
  if (!props.active) return lines;

  const a = props.active;
  const aEdges = rectEdges(a);
  const cw = props.canvasWidth;
  const ch = props.canvasHeight;
  const canvasMidX = cw / 2;
  const canvasMidY = ch / 2;

  const checkAndPush = (
    type: 'horizontal' | 'vertical',
    aVal: number,
    refVal: number
  ): void => {
    if (Math.abs(aVal - refVal) <= props.threshold) {
      if (type === 'horizontal') {
        lines.push({ type, pos: refVal, start: 0, end: cw });
      } else {
        lines.push({ type, pos: refVal, start: 0, end: ch });
      }
    }
  };

  // 对齐到画布中线
  if (props.snapToCanvasCenter) {
    checkAndPush('vertical', aEdges.midX, canvasMidX);
    checkAndPush('horizontal', aEdges.midY, canvasMidY);
  }

  // 对齐到同级节点
  for (const sib of props.siblings) {
    const sEdges = rectEdges(sib);
    // 垂直对齐（x 方向）：左对左 / 中对中 / 右对右
    checkAndPush('vertical', aEdges.left, sEdges.left);
    checkAndPush('vertical', aEdges.midX, sEdges.midX);
    checkAndPush('vertical', aEdges.right, sEdges.right);
    // 水平对齐（y 方向）：顶对顶 / 中对中 / 底对底
    checkAndPush('horizontal', aEdges.top, sEdges.top);
    checkAndPush('horizontal', aEdges.midY, sEdges.midY);
    checkAndPush('horizontal', aEdges.bottom, sEdges.bottom);
  }

  // 去重（同 type+pos 合并，范围取并集）
  const seen = new Map<string, GuideLine>();
  for (const l of lines) {
    const key = `${l.type}:${Math.round(l.pos)}`;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, { ...l });
    } else {
      existing.start = Math.min(existing.start, l.start);
      existing.end = Math.max(existing.end, l.end);
    }
  }
  return Array.from(seen.values());
});

function rectEdges(r: AlignRect): {
  left: number; right: number; midX: number;
  top: number; bottom: number; midY: number;
} {
  return {
    left: r.x,
    right: r.x + r.width,
    midX: r.x + r.width / 2,
    top: r.y,
    bottom: r.y + r.height,
    midY: r.y + r.height / 2,
  };
}

// 间距标注：active 与同级节点的水平 + 垂直间距
const distanceLabels = computed(() => {
  if (!props.active || props.siblings.length === 0) return [];
  const labels: { x: number; y: number; text: string }[] = [];
  const a = props.active;
  for (const sib of props.siblings) {
    // 水平间距（左右相邻）
    let hGap: number | null = null;
    let labelX = 0;
    let labelY = 0;
    if (sib.x >= a.x + a.width) {
      hGap = sib.x - (a.x + a.width);
      labelX = a.x + a.width + hGap / 2;
      labelY = a.y + a.height / 2;
    } else if (sib.x + sib.width <= a.x) {
      hGap = a.x - (sib.x + sib.width);
      labelX = sib.x + sib.width + hGap / 2;
      labelY = a.y + a.height / 2;
    }
    if (hGap != null && hGap > 0 && hGap < 200) {
      labels.push({ x: labelX, y: labelY, text: `${Math.round(hGap)}` });
    }
    // 垂直间距（上下相邻）
    let vGap: number | null = null;
    if (sib.y >= a.y + a.height) {
      vGap = sib.y - (a.y + a.height);
      labelX = a.x + a.width / 2;
      labelY = a.y + a.height + vGap / 2;
    } else if (sib.y + sib.height <= a.y) {
      vGap = a.y - (sib.y + sib.height);
      labelX = a.x + a.width / 2;
      labelY = sib.y + sib.height + vGap / 2;
    }
    if (vGap != null && vGap > 0 && vGap < 200) {
      labels.push({ x: labelX, y: labelY, text: `${Math.round(vGap)}` });
    }
  }
  return labels;
});
</script>

<template>
  <div v-if="active" class="lb-align-guides" aria-hidden="true">
    <svg
      class="lb-align-guides__svg"
      :width="canvasWidth"
      :height="canvasHeight"
    >
      <line
        v-for="(g, i) in guides"
        :key="`g-${i}`"
        :x1="g.type === 'horizontal' ? g.start : g.pos"
        :y1="g.type === 'horizontal' ? g.pos : g.start"
        :x2="g.type === 'horizontal' ? g.end : g.pos"
        :y2="g.type === 'horizontal' ? g.pos : g.end"
        class="lb-align-guides__line"
      />
    </svg>
    <div
      v-for="(d, i) in distanceLabels"
      :key="`d-${i}`"
      class="lb-align-guides__distance"
      :style="{ left: `${d.x}px`, top: `${d.y}px` }"
    >
      {{ d.text }}
    </div>
  </div>
</template>

<style scoped>
.lb-align-guides {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}
.lb-align-guides__svg {
  position: absolute;
  top: 0;
  left: 0;
}
.lb-align-guides__line {
  stroke: #f5222d;
  stroke-width: 1;
  stroke-dasharray: 4 3;
  opacity: 0.8;
}
.lb-align-guides__distance {
  position: absolute;
  transform: translate(-50%, -50%);
  background: #f5222d;
  color: #fff;
  font-size: 10px;
  line-height: 1;
  padding: 2px 5px;
  border-radius: 8px;
  white-space: nowrap;
}
</style>
