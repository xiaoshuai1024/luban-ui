import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import LubanInput from '../../src/lib/form/LubanInput.vue';

/**
 * 用带 v-model 的父组件包装，绕过 @vue/test-utils 2.4.6 + Vue 3.5
 * 对 update:modelValue 的 emitted() 捕获回归（emitted 不记录 v-model 事件）。
 */
function withModel(initial: string) {
  const v = ref(initial);
  const Parent = defineComponent({
    setup() {
      return () =>
        h(LubanInput, {
          modelValue: v.value,
          'onUpdate:modelValue': (val: string) => {
            v.value = val;
          },
        });
    },
  });
  return { wrapper: mount(Parent), v };
}

describe('LubanInput', () => {
  it('works with v-model', async () => {
    const { wrapper, v } = withModel('');
    await wrapper.find('input').setValue('hello');
    expect(v.value).toBe('hello');
  });

  it('renders label and placeholder', () => {
    const wrapper = mount(LubanInput, {
      props: { modelValue: '', label: '姓名', placeholder: '请输入' },
    });
    expect(wrapper.find('.lb-form-field__label').text()).toBe('姓名');
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入');
  });
});
