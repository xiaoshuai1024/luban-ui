import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import type { Component } from 'vue';

/**
 * 用带 v-model 的父组件包装，绕过 @vue/test-utils 2.4.6 + Vue 3.5
 * 对 update:modelValue 的 emitted() 捕获回归（emitted 不记录 v-model 事件）。
 *
 * 用法：const { wrapper, v } = withModel(LubanInput, { label: '姓名' }, '')
 *       await wrapper.find('input').setValue('hello')
 *       expect(v.value).toBe('hello')
 */
export function withModel<T>(
  Comp: Component,
  extraProps: Record<string, unknown>,
  initial: T,
) {
  const v = ref(initial);
  const Parent = defineComponent({
    setup() {
      return () =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        h(Comp as any, {
          modelValue: v.value,
          'onUpdate:modelValue': (val: T) => {
            v.value = val;
          },
          ...extraProps,
        });
    },
  });
  return { wrapper: mount(Parent), v };
}
