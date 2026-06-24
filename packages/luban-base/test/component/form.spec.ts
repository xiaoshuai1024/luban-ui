import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import LubanForm from '../../src/lib/form/LubanForm.vue';
import LubanInput from '../../src/lib/form/LubanInput.vue';
import LubanButton from '../../src/lib/button/LubanButton.vue';

describe('LubanForm e2e', () => {
  it('submits with nested LubanInput and LubanButton', async () => {
    // 用父组件监听 onSubmit 回调（绕过 emitted 捕获问题）
    const submitted = ref(false);
    const name = ref('');
    const Parent = defineComponent({
      setup() {
        return () =>
          h(
            LubanForm,
            { onSubmit: () => { submitted.value = true; } },
            () => [
              h(LubanInput, {
                label: '姓名',
                name: 'name',
                'data-test': 'name-input',
                modelValue: name.value,
                'onUpdate:modelValue': (v: string) => { name.value = v; },
              }),
              h(LubanButton, { type: 'submit', content: '提交' }),
            ]
          );
      },
    });
    const wrapper = mount(Parent);

    await wrapper.get('[data-test="name-input"] input').setValue('Alice');
    await wrapper.get('form').trigger('submit');

    expect(submitted.value).toBe(true);
  });
});
