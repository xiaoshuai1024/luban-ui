import { describe, it, expect } from 'vitest';
import { useHistory } from '../../src/lib/useHistory';
import type { PageSchema } from '../../src/lib/schema';

function schema(label: string): PageSchema {
  return {
    root: {
      id: 'root',
      type: 'LubanContainer',
      props: {},
      children: [{ id: 'n1', type: 'LubanText', props: { content: label } }],
    },
  };
}

describe('useHistory', () => {
  it('initializes current as a deep clone of initial', () => {
    const init = schema('a');
    const h = useHistory(init);
    expect(h.current.value.root.children?.[0].props?.content).toBe('a');
    // mutating initial must not affect current (deep clone)
    init.root.children![0].props!.content = 'b';
    expect(h.current.value.root.children?.[0].props?.content).toBe('a');
  });

  it('push then undo reverts current', () => {
    const h = useHistory(schema('a'));
    expect(h.canUndo.value).toBe(false);
    h.push(schema('b'));
    expect(h.canUndo.value).toBe(true);
    expect(h.current.value.root.children?.[0].props?.content).toBe('b');
    h.undo();
    expect(h.current.value.root.children?.[0].props?.content).toBe('a');
  });

  it('redo reapplies after undo', () => {
    const h = useHistory(schema('a'));
    h.push(schema('b'));
    h.undo();
    expect(h.canRedo.value).toBe(true);
    h.redo();
    expect(h.current.value.root.children?.[0].props?.content).toBe('b');
    expect(h.canRedo.value).toBe(false);
  });

  it('push after undo clears redo stack', () => {
    const h = useHistory(schema('a'));
    h.push(schema('b'));
    h.undo();
    expect(h.canRedo.value).toBe(true);
    h.push(schema('c'));
    expect(h.canRedo.value).toBe(false);
  });

  it('undo/redo on empty stacks are no-ops', () => {
    const h = useHistory(schema('a'));
    h.undo();
    expect(h.current.value.root.children?.[0].props?.content).toBe('a');
    h.redo();
    expect(h.current.value.root.children?.[0].props?.content).toBe('a');
  });

  it('caps undo stack at 50 entries', () => {
    const h = useHistory(schema('0'));
    for (let i = 1; i <= 60; i++) h.push(schema(String(i)));
    let undoCount = 0;
    const seen: string[] = [];
    seen.push(h.current.value.root.children?.[0].props?.content as string);
    while (h.canUndo.value) {
      h.undo();
      undoCount++;
      seen.push(h.current.value.root.children?.[0].props?.content as string);
    }
    // 栈上限 50：60 次 push 后栈最多保留 50 条（初始 current '0' 及 push 1..9 被丢弃）
    expect(undoCount).toBeLessThanOrEqual(50);
    // 最旧可达快照为 '10'（push 10-59 共 50 条留在栈中，undo 从 59 回到 10）
    expect(seen[seen.length - 1]).toBe('10');
  });

  it('reset clears stacks and sets current', () => {
    const h = useHistory(schema('a'));
    h.push(schema('b'));
    h.reset(schema('c'));
    expect(h.current.value.root.children?.[0].props?.content).toBe('c');
    expect(h.canUndo.value).toBe(false);
    expect(h.canRedo.value).toBe(false);
  });
});
