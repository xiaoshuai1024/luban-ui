import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanSwitch from '../../src/lib/form/LubanSwitch.vue';
import { withModel } from '../helpers/withModel';

describe('LubanSwitch', () => {
  it('emits update:modelValue on toggle', async () => {
    const { wrapper, v } = withModel(LubanSwitch, { label: '开关', name: 'field' }, false);
    await wrapper.get('button[role="switch"]').trigger('click');
    expect(v.value).toBe(true);
  });

  it('renders error message when error=true (T-ui-5)', () => {
    const wrapper = mount(LubanSwitch, {
      props: { modelValue: false, label: '同意', error: true, errorMessage: '须开启' },
    });
    expect(wrapper.find('.lb-form-field__error').exists()).toBe(true);
    expect(wrapper.find('.lb-form-field__error').text()).toBe('须开启');
  });
});
