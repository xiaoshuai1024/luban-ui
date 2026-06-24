import type { PageSchema, NodeSchema } from './schema';

/**
 * Reorder root.children (for design-time Sortable onEnd).
 * Mutates schema in place for reactivity.
 */
export function reorderRootChildren(
  schema: PageSchema,
  fromIndex: number,
  toIndex: number
): void {
  const children = schema.root.children ?? [];
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= children.length ||
    toIndex >= children.length
  )
    return;
  const [removed] = children.splice(fromIndex, 1);
  children.splice(toIndex, 0, removed);
}

// ---- 树操作工具函数（设计器升级 T-ui-d25）----

/** 生成唯一节点 ID */
let _nodeSeq = 0;
export function genNodeId(type: string): string {
  _nodeSeq++;
  return `${type}-${Date.now().toString(36)}-${_nodeSeq}`;
}

/** 深拷贝节点（structuredClone 优先，fallback JSON） */
export function cloneNode<T>(node: T): T {
  if (typeof structuredClone === 'function') {
    try { return structuredClone(node); } catch { /* fallback */ }
  }
  return JSON.parse(JSON.stringify(node));
}

/**
 * 深度优先查找节点 by id。
 * @returns 找到的节点或 null
 */
export function findNode(root: NodeSchema, id: string): NodeSchema | null {
  if (root.id === id) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 查找节点的父节点 by child id。
 * @returns 父节点或 null（id 为 root 时返回 null）
 */
export function findParent(root: NodeSchema, childId: string): NodeSchema | null {
  if (!root.children) return null;
  for (const child of root.children) {
    if (child.id === childId) return root;
    const found = findParent(child, childId);
    if (found) return found;
  }
  return null;
}

/**
 * 删除节点 by id（深度优先）。不删除 root。
 * @returns 是否成功删除
 */
export function removeNode(root: NodeSchema, id: string): boolean {
  if (!root.children) return false;
  const idx = root.children.findIndex((c) => c.id === id);
  if (idx >= 0) {
    root.children.splice(idx, 1);
    return true;
  }
  for (const child of root.children) {
    if (removeNode(child, id)) return true;
  }
  return false;
}

/**
 * 复制节点 by id（深拷贝 + 递归新 id）。新节点插入到原节点之后。
 * @returns 新节点或 null（未找到）
 */
export function duplicateNode(root: NodeSchema, id: string): NodeSchema | null {
  const parent = findParent(root, id);
  if (!parent || !parent.children) return null;
  const idx = parent.children.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const copy = cloneNode(parent.children[idx]);
  reassignIds(copy);
  parent.children.splice(idx + 1, 0, copy);
  return copy;
}

/** 递归重新分配节点 id（用于复制） */
function reassignIds(node: NodeSchema): void {
  node.id = genNodeId(node.type);
  if (node.children) {
    for (const child of node.children) {
      reassignIds(child);
    }
  }
}

/**
 * 在同级 siblings 中上下移动节点。
 * @returns 是否成功移动
 */
export function moveNode(root: NodeSchema, id: string, direction: 'up' | 'down'): boolean {
  const parent = findParent(root, id);
  if (!parent || !parent.children) return false;
  const idx = parent.children.findIndex((c) => c.id === id);
  if (idx < 0) return false;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= parent.children.length) return false;
  const [removed] = parent.children.splice(idx, 1);
  parent.children.splice(targetIdx, 0, removed);
  return true;
}

/**
 * 插入节点到指定父容器的指定位置。
 * @param root 根节点
 * @param node 要插入的节点
 * @param parentId 父容器 id（'root' 表示根）
 * @param index 插入位置（不传则追加到末尾）
 * @returns 是否成功
 */
export function insertNode(
  root: NodeSchema,
  node: NodeSchema,
  parentId: string,
  index?: number
): boolean {
  const parent = parentId === 'root' || root.id === parentId ? root : findNode(root, parentId);
  if (!parent) return false;
  if (!parent.children) parent.children = [];
  if (index == null || index < 0 || index > parent.children.length) {
    parent.children.push(node);
  } else {
    parent.children.splice(index, 0, node);
  }
  return true;
}

/**
 * 更新节点 props（浅合并 patch）。
 * @returns 是否成功
 */
export function updateNodeProps(
  root: NodeSchema,
  id: string,
  patch: Record<string, unknown>
): boolean {
  const node = findNode(root, id);
  if (!node) return false;
  node.props = { ...(node.props ?? {}), ...patch };
  return true;
}

/**
 * 置顶节点（移到同级第一个）。
 * @returns 是否成功
 */
export function bringToFront(root: NodeSchema, id: string): boolean {
  const parent = findParent(root, id);
  if (!parent || !parent.children) return false;
  const idx = parent.children.findIndex((c) => c.id === id);
  if (idx <= 0) return false;
  const [removed] = parent.children.splice(idx, 1);
  parent.children.unshift(removed);
  return true;
}

/**
 * 置底节点（移到同级最后一个）。
 * @returns 是否成功
 */
export function sendToBack(root: NodeSchema, id: string): boolean {
  const parent = findParent(root, id);
  if (!parent || !parent.children) return false;
  const idx = parent.children.findIndex((c) => c.id === id);
  if (idx < 0 || idx === parent.children.length - 1) return false;
  const [removed] = parent.children.splice(idx, 1);
  parent.children.push(removed);
  return true;
}
