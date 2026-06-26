import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanContentList from './LubanContentList.vue';

describe('LubanContentList', () => {
  it('renders with empty items', () => {
    const wrapper = mount(LubanContentList, { props: { items: [] } });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders list items', () => {
    const wrapper = mount(LubanContentList, {
      props: { items: [{ title: 'Item 1', text: 'Text 1' }, { title: 'Item 2', text: 'Text 2' }] },
    });
    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).toContain('Item 2');
  });
});
