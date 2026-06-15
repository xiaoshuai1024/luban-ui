import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanCheckbox from '../../src/lib/form/LubanCheckbox.vue';
import { withModel } from '../helpers/withModel';

describe('LubanCheckbox', () => {
  it('emits update:modelValue on toggle', async () => {
    const { wrapper, v } = withModel(LubanCheckbox, { label: '复选框', name: 'field' }, false);
    await wrapper.find('input[type="checkbox"]').setValue(true);
    expect(v.value).toBe(true);
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
