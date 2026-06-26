import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanRadioGroup from '../../src/lib/form/LubanRadioGroup.vue';
import { withModel } from '../helpers/withModel';

describe('LubanRadioGroup', () => {
  it('emits update:modelValue on change', async () => {
    const { wrapper, v } = withModel(
      LubanRadioGroup,
      {
        label: '单选',
        name: 'field',
        options: [
          { label: '1', value: 1 },
          { label: '2', value: 2 },
        ],
      },
      null as string | number | null,
    );
    const radios = wrapper.findAll('input[type="radio"]');
    await radios[1].setValue(true);
    expect(v.value).toBe(2);
  });

  it('renders error message when error=true (T-ui-5)', () => {
    const wrapper = mount(LubanRadioGroup, {
      props: {
        modelValue: null,
        label: '单选',
        options: [{ label: '1', value: 1 }],
        error: true,
        errorMessage: '必选一项',
      },
    });
    expect(wrapper.find('.lb-form-field__error').exists()).toBe(true);
    expect(wrapper.find('.lb-form-field__error').text()).toBe('必选一项');
  });
});
