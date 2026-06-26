import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanSidePanel from './LubanSidePanel.vue';

describe('LubanSidePanel', () => {
  it('renders with default props', () => {
    const wrapper = mount(LubanSidePanel);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders slot content', () => {
    const wrapper = mount(LubanSidePanel, {
      slots: { default: 'Panel Content' },
    });
    expect(wrapper.text()).toContain('Panel Content');
  });
});
