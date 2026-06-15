import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanCheckbox from '../../src/lib/form/LubanCheckbox.vue';

describe('LubanCheckbox', () => {
  it('emits update:modelValue on toggle', async () => {
    const wrapper = mount(LubanCheckbox, {
      props: {
        modelValue: false,
        label: '复选框',
        name: 'field',
      },
    });
    const input = wrapper.get('input[type="checkbox"]');
    await input.setValue(true);
    const update = wrapper.emitted('update:modelValue');
    expect(update).toBeTruthy();
  });

  it('renders error message when error=true (T-ui-5)', () => {
    const wrapper = mount(LubanCheckbox, {
      props: { modelValue: false, label: '同意', error: true, errorMessage: '必勾选' },
    });
    expect(wrapper.find('.lb-form-field__error').exists()).toBe(true);
    expect(wrapper.find('.lb-form-field__error').text()).toBe('必勾选');
  });

  it('does not render error message when error=false', () => {
    const wrapper = mount(LubanCheckbox, {
      props: { modelValue: false, label: '同意', error: false, errorMessage: '必勾选' },
    });
    expect(wrapper.find('.lb-form-field__error').exists()).toBe(false);
  });
});

