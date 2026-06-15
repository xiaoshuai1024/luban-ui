import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { PageSchema } from './schema';

/**
 * 撤销/重做引擎（T-ui-2）：维护 schema 快照栈，支持 push/undo/redo/reset。
 * 栈深上限 MAX，超出丢弃最旧快照。深拷贝避免引用污染。
 *
 * 注意：undoStack/redoStack 必须用 ref 包装，否则 computed(canUndo/canRedo)
 * 无法响应其 length 变化。
 *
 * @param initial 初始 schema（深拷贝为 current）
 * @returns { current, push, undo, redo, canUndo, canRedo, reset }
 */
export function useHistory(initial: PageSchema): {
  current: Ref<PageSchema>;
  push: (s: PageSchema) => void;
  undo: () => void;
  redo: () => void;
  canUndo: ComputedRef<boolean>;
  canRedo: ComputedRef<boolean>;
  reset: (s: PageSchema) => void;
} {
  const MAX = 50;

  const undoStack = ref<PageSchema[]>([]);
  const redoStack = ref<PageSchema[]>([]);
  const current = ref<PageSchema>(clone(initial)) as Ref<PageSchema>;

  function clone(s: PageSchema): PageSchema {
    return JSON.parse(JSON.stringify(s)) as PageSchema;
  }

  function push(s: PageSchema): void {
    undoStack.value.push(clone(current.value));
    if (undoStack.value.length > MAX) undoStack.value.shift();
    current.value = clone(s);
    redoStack.value = []; // 新动作清空重做栈
  }

  function undo(): void {
    if (undoStack.value.length === 0) return;
    redoStack.value.push(clone(current.value));
    const prev = undoStack.value.pop()!;
    current.value = clone(prev);
  }

  function redo(): void {
    if (redoStack.value.length === 0) return;
    undoStack.value.push(clone(current.value));
    const next = redoStack.value.pop()!;
    current.value = clone(next);
  }

  function reset(s: PageSchema): void {
    undoStack.value = [];
    redoStack.value = [];
    current.value = clone(s);
  }

  const canUndo = computed(() => undoStack.value.length > 0);
  const canRedo = computed(() => redoStack.value.length > 0);

  return { current, push, undo, redo, canUndo, canRedo, reset };
}
