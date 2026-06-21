/**
 * V2-T12 拖拽对齐辅助线计算。
 *
 * 纯函数：给定"拖动中节点的矩形" + "画布内其他节点的矩形数组" + 容器尺寸，
 * 计算应该显示的对齐辅助线（垂直/水平线 + 吸附建议）。
 *
 * 对齐规则（阈值 threshold=6px）：
 *  - 垂直对齐：左边缘 / 水平中线 / 右边缘 重合 → 显示垂直辅助线
 *  - 水平对齐：顶边缘 / 垂直中线 / 底边缘 重合 → 显示水平辅助线
 *  - 吸附：若差值 ≤ threshold，返回建议的吸附位置（snap）
 *
 * 设计态：DesignRenderer 拖拽时实时调用，渲染辅助线 overlay。
 */

/** 节点矩形（相对画布的绝对坐标） */
export interface Rect {
  id: string
  left: number
  top: number
  width: number
  height: number
}

/** 一条辅助线（垂直线 x=固定 / 水平线 y=固定） */
export interface GuideLine {
  /** 垂直线时 x 坐标；水平线时 y 坐标 */
  position: number
  /** 垂直 vs 水平 */
  orientation: 'vertical' | 'horizontal'
  /** 起止范围（画另一条轴的延伸范围） */
  start: number
  end: number
}

/** 对齐计算结果 */
export interface AlignResult {
  /** 需要显示的辅助线 */
  guides: GuideLine[]
  /** 吸附建议：若拖动节点应吸附，返回 {x?, y?} 目标坐标（与 guides 对应） */
  snap?: { x?: number; y?: number }
}

const DEFAULT_THRESHOLD = 6

/**
 * 计算拖动节点与其他节点的对齐辅助线 + 吸附建议。
 *
 * @param dragging 拖动中节点的矩形（实时更新）
 * @param others 画布内其他节点矩形（不含 dragging 自身；通常含容器边缘）
 * @param threshold 对齐阈值（px），默认 6
 */
export function computeAlignGuides(
  dragging: Rect,
  others: Rect[],
  threshold = DEFAULT_THRESHOLD
): AlignResult {
  const guides: GuideLine[] = []
  let snapX: number | undefined
  let snapY: number | undefined

  // 拖动节点的 6 条参考线坐标
  const dLeft = dragging.left
  const dCenterX = dragging.left + dragging.width / 2
  const dRight = dragging.left + dragging.width
  const dTop = dragging.top
  const dCenterY = dragging.top + dragging.height / 2
  const dBottom = dragging.top + dragging.height

  // 垂直对齐候选 x（拖动节点的 left/centerX/right 与其他节点三者比对）
  const vCandidates = [
    { dragPos: dLeft, axis: 'left' as const },
    { dragPos: dCenterX, axis: 'centerX' as const },
    { dragPos: dRight, axis: 'right' as const },
  ]
  // 水平对齐候选 y
  const hCandidates = [
    { dragPos: dTop, axis: 'top' as const },
    { dragPos: dCenterY, axis: 'centerY' as const },
    { dragPos: dBottom, axis: 'bottom' as const },
  ]

  let minDx = threshold + 1
  let minDy = threshold + 1

  for (const other of others) {
    const oLeft = other.left
    const oCenterX = other.left + other.width / 2
    const oRight = other.left + other.width
    const oTop = other.top
    const oCenterY = other.top + other.height / 2
    const oBottom = other.top + other.height

    // 垂直辅助线候选 x（其他节点的 left/centerX/right）
    const oXs = [oLeft, oCenterX, oRight]
    // 水平辅助线候选 y
    const oYs = [oTop, oCenterY, oBottom]

    for (const vc of vCandidates) {
      for (const ox of oXs) {
        const diff = Math.abs(vc.dragPos - ox)
        if (diff <= threshold) {
          // 辅助线 x = ox（吸附目标），延伸覆盖两节点的纵向范围
          const yStart = Math.min(dragging.top, other.top)
          const yEnd = Math.max(dragging.bottom, other.bottom)
          guides.push({ position: ox, orientation: 'vertical', start: yStart, end: yEnd })
          // 取最小差作为吸附
          if (diff < minDx) {
            minDx = diff
            // 吸附：把拖动节点移到使其该轴对齐 ox 的位置
            snapX = ox - (vc.axis === 'left' ? 0 : vc.axis === 'centerX' ? dragging.width / 2 : dragging.width)
          }
        }
      }
    }

    for (const hc of hCandidates) {
      for (const oy of oYs) {
        const diff = Math.abs(hc.dragPos - oy)
        if (diff <= threshold) {
          const xStart = Math.min(dragging.left, other.left)
          const xEnd = Math.max(dragging.right, other.right)
          guides.push({ position: oy, orientation: 'horizontal', start: xStart, end: xEnd })
          if (diff < minDy) {
            minDy = diff
            snapY = oy - (hc.axis === 'top' ? 0 : hc.axis === 'centerY' ? dragging.height / 2 : dragging.height)
          }
        }
      }
    }
  }

  return {
    guides,
    snap: snapX !== undefined || snapY !== undefined ? { x: snapX, y: snapY } : undefined,
  }
}

/**
 * 收集画布内所有节点矩形（供 computeAlignGuides 的 others 参数）。
 * 通过 DOM querySelector([data-lb-node]) 读 getBoundingClientRect。
 * 排除 draggingId 自身。
 *
 * SSR/无 DOM 环境返回空数组。
 */
export function collectNodeRects(container: HTMLElement | null, draggingId: string | null): Rect[] {
  if (!container || typeof DOMRect === 'undefined') return []
  const containerRect = container.getBoundingClientRect()
  const rects: Rect[] = []
  const els = container.querySelectorAll<HTMLElement>('[data-lb-node]')
  for (const el of els) {
    const id = el.dataset.lbNode
    if (!id || id === draggingId) continue
    const r = el.getBoundingClientRect()
    rects.push({
      id,
      left: r.left - containerRect.left,
      top: r.top - containerRect.top,
      width: r.width,
      height: r.height,
    })
  }
  return rects
}

/** 去重辅助线（相同 position+orientation 只保留范围最大的） */
export function dedupeGuides(guides: GuideLine[]): GuideLine[] {
  const map = new Map<string, GuideLine>()
  for (const g of guides) {
    const key = `${g.orientation}:${Math.round(g.position)}`
    const existing = map.get(key)
    if (!existing || g.start < existing.start || g.end > existing.end) {
      map.set(key, {
        position: g.position,
        orientation: g.orientation,
        start: Math.min(existing?.start ?? g.start, g.start),
        end: Math.max(existing?.end ?? g.end, g.end),
      })
    }
  }
  return Array.from(map.values())
}
