import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanInput from './LubanInput.vue';

describe('LubanInput', () => {
  it('renders input element', () => {
    const wrapper = mount(LubanInput);
    expect(wrapper.find('input').exists() || wrapper.findComponent({ name: 'ElInput' }).exists()).toBe(true);
  });

  it('applies placeholder prop', () => {
    const wrapper = mount(LubanInput, {
      props: { placeholder: 'Enter text' },
    });
    expect(wrapper.html()).toContain('Enter text');
  });

  it('emits update:modelValue', async () => {
    const wrapper = mount(LubanInput, {
      props: { modelValue: '' },
    });
    const input = wrapper.find('input');
    if (input.exists()) {
      await input.setValue('test value');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    }
  });
});
