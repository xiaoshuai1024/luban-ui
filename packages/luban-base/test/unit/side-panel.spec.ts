import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import LubanSidePanel from '../../src/lib/layout/LubanSidePanel.vue';

describe('LubanSidePanel', () => {
  it('renders title and body, closes on click', async () => {
    // 用父组件 + v-model 监听关闭事件（绕过 emitted 捕获问题）
    const visible = ref(true);
    const Parent = defineComponent({
      setup() {
        return () =>
          h(
            LubanSidePanel,
            {
              modelValue: visible.value,
              'onUpdate:modelValue': (v: boolean) => { visible.value = v; },
              title: 'Panel Title',
              size: 'small',
            },
            { body: () => h('div', { class: 'body-slot' }, 'Body') }
          );
      },
    });
    const wrapper = mount(Parent);
    expect(wrapper.find('.lb-side-panel__title').text()).toBe('Panel Title');
    expect(wrapper.find('.body-slot').exists()).toBe(true);

    await wrapper.get('.lb-side-panel__close').trigger('click');
    expect(visible.value).toBe(false);
  });
});
