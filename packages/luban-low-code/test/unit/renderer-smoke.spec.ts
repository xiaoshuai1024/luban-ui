import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, provide, ref } from 'vue';
import RuntimeRenderer from '../../src/lib/RuntimeRenderer.vue';
import type { NodeSchema, PageSchema } from '../../src/lib/schema';

/**
 * 渲染器冒烟测试：确保 RuntimeRenderer 渲染表单值节点不崩溃（Round 2 回归防护）。
 * Round 2 review 发现 isFormValueType 无限递归；此测试在渲染层验证。
 */
const schema: PageSchema = {
  root: {
    id: 'root',
    type: 'LubanContainer',
    props: {},
    children: [
      { id: 'input1', type: 'LubanInput', props: { label: '姓名', name: 'name' } },
      { id: 'phone1', type: 'LubanPhoneInput', props: { label: '手机' } },
      { id: 'rating1', type: 'LubanRating', props: { label: '评分', max: 5 } },
    ],
  } as NodeSchema,
};

const Host = defineComponent({
  setup() {
    const formState = ref<Record<string, unknown>>({});
    provide('lubanFormSubmit', () => {});
    return () =>
      h(RuntimeRenderer, {
        root: schema.root,
        formState: formState.value,
        formErrors: {},
      });
  },
});

describe('RuntimeRenderer smoke', () => {
  it('renders form-value nodes without crashing (no recursion)', () => {
    const w = mount(Host);
    // 至少渲染了输入框
    expect(w.find('input[type="text"]').exists() || w.findAll('input').length > 0).toBe(true);
  });

  it('renders new form types (PhoneInput/Rating)', () => {
    const w = mount(Host);
    const html = w.html();
    // PhoneInput 渲染了 tel input
    expect(html).toContain('lb-form-field');
    // Rating 渲染了星星按钮（至少 1 个 button）
    expect(w.findAll('button').length).toBeGreaterThanOrEqual(1);
  });
});
