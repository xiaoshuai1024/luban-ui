import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanRow from './LubanRow.vue';

describe('LubanRow', () => {
  it('renders with default props', () => {
    const wrapper = mount(LubanRow);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders slot children', () => {
    const wrapper = mount(LubanRow, {
      slots: { default: '<div class="col-item">Col</div>' },
    });
    expect(wrapper.html()).toContain('Col');
  });
});
