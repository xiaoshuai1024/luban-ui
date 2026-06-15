import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
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

/** 用父组件监听 OutlineTree 事件（绕过 emitted 捕获问题） */
function mountWithListeners(extraProps: Record<string, unknown> = {}) {
  const selected = ref<string | null>(null);
  const deleted = ref<string | null>(null);
  const duplicated = ref<string | null>(null);
  const reordered = ref<[string, string] | null>(null);
  const Parent = defineComponent({
    setup() {
      return () => h(OutlineTree, {
        schema,
        selectedId: selected.value,
        ...extraProps,
        onSelect: (id: string) => { selected.value = id; },
        onDelete: (id: string) => { deleted.value = id; },
        onDuplicate: (id: string) => { duplicated.value = id; },
        onReorder: (id: string, dir: string) => { reordered.value = [id, dir]; },
      });
    },
  });
  return { wrapper: mount(Parent), selected, deleted, duplicated, reordered };
}

describe('OutlineTree', () => {
  it('renders labels for all nodes including nested', () => {
    const w = mount(OutlineTree, { props: { schema } });
    expect(w.text()).toContain('文本');
    expect(w.text()).toContain('表单');
    expect(w.text()).toContain('输入框');
  });

  it('emits select with node id when a row is clicked', async () => {
    const { wrapper, selected } = mountWithListeners();
    const rows = wrapper.findAll('.lb-outline-node__row');
    await rows[0].trigger('click');
    expect(selected.value).toBe('t1');
  });

  it('highlights the selectedId row', () => {
    const w = mount(OutlineTree, { props: { schema, selectedId: 'f1' } });
    const rows = w.findAll('.lb-outline-node__row');
    const formRow = rows.find(r => r.text().includes('表单'));
    expect(formRow?.classes()).toContain('lb-outline-node__row--selected');
  });

  it('emits delete when the delete button is clicked', async () => {
    const { wrapper, deleted } = mountWithListeners();
    const rows = wrapper.findAll('.lb-outline-node__row');
    const delBtn = rows[0].find('.lb-outline-node__btn--danger');
    await delBtn.trigger('click');
    expect(deleted.value).toBe('t1');
  });

  it('emits reorder up', async () => {
    const { wrapper, reordered } = mountWithListeners();
    const rows = wrapper.findAll('.lb-outline-node__row');
    const upBtn = rows[1].findAll('button')[0]; // ↑
    await upBtn.trigger('click');
    expect(reordered.value).toEqual(['f1', 'up']);
  });

  it('emits duplicate', async () => {
    const { wrapper, duplicated } = mountWithListeners();
    const rows = wrapper.findAll('.lb-outline-node__row');
    const dupBtn = rows[0].findAll('button')[2]; // ⧉
    await dupBtn.trigger('click');
    expect(duplicated.value).toBe('t1');
  });

  it('renders empty state when schema has no children', () => {
    const empty: PageSchema = { root: { id: 'root', type: 'LubanContainer', props: {}, children: [] } };
    const w = mount(OutlineTree, { props: { schema: empty } });
    expect(w.find('.lb-outline-tree__empty').exists()).toBe(true);
  });
});
