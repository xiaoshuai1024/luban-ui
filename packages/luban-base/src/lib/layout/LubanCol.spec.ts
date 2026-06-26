import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanCol from './LubanCol.vue';

describe('LubanCol', () => {
  it('renders with default props', () => {
    const wrapper = mount(LubanCol);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders slot content', () => {
    const wrapper = mount(LubanCol, {
      slots: { default: 'Content' },
    });
    expect(wrapper.text()).toContain('Content');
  });

  it('applies span prop', () => {
    const wrapper = mount(LubanCol, { props: { span: 12 } });
    expect(wrapper.exists()).toBe(true);
  });
});
