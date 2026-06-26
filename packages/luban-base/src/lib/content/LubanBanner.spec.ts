import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanBanner from './LubanBanner.vue';

describe('LubanBanner', () => {
  it('renders with content prop', () => {
    const wrapper = mount(LubanBanner, {
      props: { content: 'Promo Banner', title: 'Promo' },
    });
    expect(wrapper.html()).toBeTruthy();
  });

  it('renders with default props', () => {
    const wrapper = mount(LubanBanner);
    expect(wrapper.exists()).toBe(true);
  });
});
