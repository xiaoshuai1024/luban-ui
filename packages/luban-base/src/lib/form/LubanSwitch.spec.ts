import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanSwitch from './LubanSwitch.vue';

describe('LubanSwitch', () => {
  it('renders', () => {
    const wrapper = mount(LubanSwitch);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders with modelValue', () => {
    const wrapper = mount(LubanSwitch, { props: { modelValue: true } });
    expect(wrapper.exists()).toBe(true);
  });
});
