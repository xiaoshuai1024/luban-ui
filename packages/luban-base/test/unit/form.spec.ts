import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import LubanForm from '../../src/lib/form/LubanForm.vue';

describe('LubanForm', () => {
  it('emits submit event', async () => {
    // 用父组件监听 onSubmit 回调（绕过 emitted 捕获问题）
    const submitted = ref(false);
    const Parent = defineComponent({
      setup() {
        return () =>
          h(
            LubanForm,
            { size: 'medium', onSubmit: () => { submitted.value = true; } },
            () => h('button', { type: 'submit' }, '提交')
          );
      },
    });
    const wrapper = mount(Parent);
    await wrapper.find('form').trigger('submit');
    expect(submitted.value).toBe(true);
  });
});
