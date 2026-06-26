import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanFooter from './LubanFooter.vue';

describe('LubanFooter', () => {
  it('renders', () => {
    const wrapper = mount(LubanFooter);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders copyright text', () => {
    const wrapper = mount(LubanFooter, { props: { copyright: '© 2026 Luban' } });
    expect(wrapper.html()).toContain('2026');
  });
});
