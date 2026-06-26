import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanCTA from './LubanCTA.vue';

describe('LubanCTA', () => {
  it('renders with text prop', () => {
    const wrapper = mount(LubanCTA, { props: { text: 'Get Started' } });
    expect(wrapper.html()).toBeTruthy();
  });

  it('renders with link', () => {
    const wrapper = mount(LubanCTA, { props: { text: 'Click', link: '/start' } });
    expect(wrapper.exists()).toBe(true);
  });
});
