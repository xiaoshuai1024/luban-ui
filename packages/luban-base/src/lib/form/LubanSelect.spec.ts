import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanSelect from './LubanSelect.vue';

describe('LubanSelect', () => {
  it('renders select element', () => {
    const wrapper = mount(LubanSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    });
    expect(wrapper.html()).toBeTruthy();
  });

  it('renders options', () => {
    const wrapper = mount(LubanSelect, {
      props: { options: [{ label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }] },
    });
    expect(wrapper.html()).toContain('Option A');
    expect(wrapper.html()).toContain('Option B');
  });
});
