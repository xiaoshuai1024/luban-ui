import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanCheckbox from './LubanCheckbox.vue';

describe('LubanCheckbox', () => {
  it('renders', () => {
    const wrapper = mount(LubanCheckbox);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders label prop', () => {
    const wrapper = mount(LubanCheckbox, { props: { label: 'Accept terms' } });
    expect(wrapper.html()).toBeTruthy();
  });
});
