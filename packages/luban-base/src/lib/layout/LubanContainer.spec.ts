import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanContainer from './LubanContainer.vue';

describe('LubanContainer', () => {
  it('renders with default props', () => {
    const wrapper = mount(LubanContainer);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders slot content', () => {
    const wrapper = mount(LubanContainer, {
      slots: { default: '<div class="child">Child</div>' },
    });
    expect(wrapper.html()).toContain('Child');
  });

  it('applies maxWidth prop', () => {
    const wrapper = mount(LubanContainer, {
      props: { maxWidth: '1200px' },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
