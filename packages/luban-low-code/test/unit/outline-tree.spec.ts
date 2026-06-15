import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import OutlineTree from '../../src/lib/OutlineTree.vue';
import type { PageSchema } from '../../src/lib/schema';

const schema: PageSchema = {
  root: {
    id: 'root',
    type: 'LubanContainer',
    props: {},
    children: [
      { id: 't1', type: 'LubanText', props: { content: 'a' } },
      {
        id: 'f1', type: 'LubanForm', props: {}, children: [
          { id: 'i1', type: 'LubanInput', props: {} },
        ],
      },
    ],
  },
};

describe('OutlineTree', () => {
  it('renders labels for all nodes including nested', () => {
    const w = mount(OutlineTree, { props: { schema } });
    // 文本 / 表单 / 输入框 标签均应渲染（来自 componentMeta label）
    expect(w.text()).toContain('文本');
    expect(w.text()).toContain('表单');
    expect(w.text()).toContain('输入框');
  });

  it('emits select with node id when a row is clicked', async () => {
    const w = mount(OutlineTree, { props: { schema } });
    const rows = w.findAll('.lb-outline-node__row');
    await rows[0].trigger('click');
    const events = w.emitted('select');
    expect(events).toBeTruthy();
    expect(events![0][0]).toBe('t1');
  });

  it('highlights the selectedId row', () => {
    const w = mount(OutlineTree, { props: { schema, selectedId: 'f1' } });
    const rows = w.findAll('.lb-outline-node__row');
    const formRow = rows.find(r => r.text().includes('表单'));
    expect(formRow?.classes()).toContain('lb-outline-node__row--selected');
  });

  it('emits delete when the delete button is clicked', async () => {
    const w = mount(OutlineTree, { props: { schema } });
    const rows = w.findAll('.lb-outline-node__row');
    // hover-only actions: find the danger button inside first row
    const delBtn = rows[0].find('.lb-outline-node__btn--danger');
    await delBtn.trigger('click');
    const events = w.emitted('delete');
    expect(events).toBeTruthy();
    expect(events![0][0]).toBe('t1');
  });

  it('emits reorder up', async () => {
    const w = mount(OutlineTree, { props: { schema } });
    const rows = w.findAll('.lb-outline-node__row');
    const upBtn = rows[1].findAll('button')[0]; // ↑
    await upBtn.trigger('click');
    const events = w.emitted('reorder');
    expect(events).toBeTruthy();
    expect(events![0]).toEqual(['f1', 'up']);
  });

  it('emits duplicate', async () => {
    const w = mount(OutlineTree, { props: { schema } });
    const rows = w.findAll('.lb-outline-node__row');
    const dupBtn = rows[0].findAll('button')[2]; // ⧉
    await dupBtn.trigger('click');
    const events = w.emitted('duplicate');
    expect(events).toBeTruthy();
    expect(events![0][0]).toBe('t1');
  });

  it('renders empty state when schema has no children', () => {
    const empty: PageSchema = { root: { id: 'root', type: 'LubanContainer', props: {}, children: [] } };
    const w = mount(OutlineTree, { props: { schema: empty } });
    expect(w.find('.lb-outline-tree__empty').exists()).toBe(true);
  });
});
