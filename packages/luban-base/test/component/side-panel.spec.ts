import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import LubanSidePanel from '../../src/lib/layout/LubanSidePanel.vue';

describe('LubanSidePanel e2e', () => {
  it('shows body content and can be closed', async () => {
    const visible = ref(true);
    const Parent = defineComponent({
      setup() {
        return () =>
          h(
            LubanSidePanel,
            {
              modelValue: visible.value,
              'onUpdate:modelValue': (v: boolean) => {
                visible.value = v;
              },
              title: '配置',
            },
            {
              body: () =>
                h('div', { 'data-test': 'panel-body' }, 'Body Content'),
            },
          );
      },
    });
    const wrapper = mount(Parent);

    expect(wrapper.find('[data-test="panel-body"]').exists()).toBe(true);
    await wrapper.get('.lb-side-panel__close').trigger('click');
    expect(visible.value).toBe(false);
  });
});
