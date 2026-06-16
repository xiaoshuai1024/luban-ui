import { describe, it, expect } from 'vitest';
import {
  findNode, findParent, removeNode, duplicateNode, moveNode, insertNode,
  updateNodeProps, bringToFront, sendToBack, reorderRootChildren,
} from '../../src/lib/schemaUtils';
import type { PageSchema, NodeSchema } from '../../src/lib/schema';

function makeSchema(): PageSchema {
  return {
    root: {
      id: 'root',
      type: 'LubanContainer',
      props: {},
      children: [
        { id: 'a', type: 'LubanText', props: { content: 'A' } },
        {
          id: 'b', type: 'LubanForm', props: {}, children: [
            { id: 'b1', type: 'LubanInput', props: { label: 'B1' } },
            { id: 'b2', type: 'LubanInput', props: { label: 'B2' } },
          ],
        },
        { id: 'c', type: 'LubanButton', props: { content: 'C' } },
      ],
    },
  };
}

describe('schemaUtils', () => {
  describe('findNode', () => {
    it('finds root by id', () => {
      expect(findNode(makeSchema().root, 'root')?.id).toBe('root');
    });
    it('finds nested child', () => {
      expect(findNode(makeSchema().root, 'b2')?.id).toBe('b2');
    });
    it('returns null for non-existent', () => {
      expect(findNode(makeSchema().root, 'zzz')).toBeNull();
    });
  });

  describe('findParent', () => {
    it('finds parent of top-level node', () => {
      expect(findParent(makeSchema().root, 'a')?.id).toBe('root');
    });
    it('finds parent of nested node', () => {
      expect(findParent(makeSchema().root, 'b1')?.id).toBe('b');
    });
    it('returns null for root', () => {
      expect(findParent(makeSchema().root, 'root')).toBeNull();
    });
  });

  describe('removeNode', () => {
    it('removes top-level node', () => {
      const s = makeSchema();
      expect(removeNode(s.root, 'a')).toBe(true);
      expect(s.root.children?.find((c) => c.id === 'a')).toBeUndefined();
    });
    it('removes nested node', () => {
      const s = makeSchema();
      expect(removeNode(s.root, 'b1')).toBe(true);
      const form = findNode(s.root, 'b');
      expect(form?.children?.length).toBe(1);
    });
    it('fails for non-existent', () => {
      expect(removeNode(makeSchema().root, 'zzz')).toBe(false);
    });
    it('fails for root', () => {
      const s = makeSchema();
      expect(removeNode(s.root, 'root')).toBe(false);
      expect(s.root).toBeDefined(); // root not deleted
    });
  });

  describe('duplicateNode', () => {
    it('duplicates and inserts after original with new ids', () => {
      const s = makeSchema();
      const copy = duplicateNode(s.root, 'b');
      expect(copy).not.toBeNull();
      expect(copy?.id).not.toBe('b'); // new id
      // b's children should also have new ids
      expect(copy?.children?.[0].id).not.toBe('b1');
      // inserted after b
      const idx = s.root.children!.findIndex((c) => c.id === 'b');
      expect(s.root.children![idx + 1].type).toBe('LubanForm');
    });
    it('returns null for non-existent', () => {
      expect(duplicateNode(makeSchema().root, 'zzz')).toBeNull();
    });
  });

  describe('moveNode', () => {
    it('moves up', () => {
      const s = makeSchema();
      expect(moveNode(s.root, 'c', 'up')).toBe(true);
      // c was at index 2, now at 1
      expect(s.root.children![1].id).toBe('c');
    });
    it('moves down', () => {
      const s = makeSchema();
      expect(moveNode(s.root, 'a', 'down')).toBe(true);
      expect(s.root.children![0].id).toBe('b');
      expect(s.root.children![1].id).toBe('a');
    });
    it('fails at boundary (first up)', () => {
      expect(moveNode(makeSchema().root, 'a', 'up')).toBe(false);
    });
    it('moves nested node', () => {
      const s = makeSchema();
      expect(moveNode(s.root, 'b2', 'up')).toBe(true);
      const form = findNode(s.root, 'b');
      expect(form?.children![0].id).toBe('b2');
    });
  });

  describe('insertNode', () => {
    it('appends to root', () => {
      const s = makeSchema();
      const node: NodeSchema = { id: 'new', type: 'LubanText', props: {} };
      expect(insertNode(s.root, node, 'root')).toBe(true);
      expect(s.root.children?.length).toBe(4);
      expect(s.root.children![3].id).toBe('new');
    });
    it('inserts at index', () => {
      const s = makeSchema();
      const node: NodeSchema = { id: 'new', type: 'LubanText', props: {} };
      expect(insertNode(s.root, node, 'root', 1)).toBe(true);
      expect(s.root.children![1].id).toBe('new');
    });
    it('inserts into nested container', () => {
      const s = makeSchema();
      const node: NodeSchema = { id: 'new', type: 'LubanInput', props: {} };
      expect(insertNode(s.root, node, 'b')).toBe(true);
      const form = findNode(s.root, 'b');
      expect(form?.children?.length).toBe(3);
    });
    it('fails for non-existent parent', () => {
      const node: NodeSchema = { id: 'new', type: 'LubanText', props: {} };
      expect(insertNode(makeSchema().root, node, 'zzz')).toBe(false);
    });
  });

  describe('updateNodeProps', () => {
    it('merges patch into props', () => {
      const s = makeSchema();
      expect(updateNodeProps(s.root, 'a', { content: 'updated', extra: 1 })).toBe(true);
      expect(findNode(s.root, 'a')?.props?.content).toBe('updated');
      expect(findNode(s.root, 'a')?.props?.extra).toBe(1);
    });
    it('fails for non-existent', () => {
      expect(updateNodeProps(makeSchema().root, 'zzz', {})).toBe(false);
    });
  });

  describe('bringToFront / sendToBack', () => {
    it('brings to front', () => {
      const s = makeSchema();
      expect(bringToFront(s.root, 'c')).toBe(true);
      expect(s.root.children![0].id).toBe('c');
    });
    it('sends to back', () => {
      const s = makeSchema();
      expect(sendToBack(s.root, 'a')).toBe(true);
      expect(s.root.children![2].id).toBe('a');
    });
    it('no-op for already front', () => {
      expect(bringToFront(makeSchema().root, 'a')).toBe(false);
    });
  });

  describe('reorderRootChildren', () => {
    it('reorders within bounds', () => {
      const s = makeSchema();
      reorderRootChildren(s, 0, 2);
      expect(s.root.children![0].id).toBe('b');
      expect(s.root.children![2].id).toBe('a');
    });
    it('no-op for out of bounds', () => {
      const s = makeSchema();
      reorderRootChildren(s, -1, 0);
      expect(s.root.children![0].id).toBe('a'); // unchanged
    });
  });
});
