import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import PropertyPanel from '../../src/lib/PropertyPanel.vue';
import type { ComponentMeta } from '../../src/lib/componentMeta';

function metaOf(propSchema: ComponentMeta['propSchema']): ComponentMeta {
  return {
    type: 'TestComp',
    category: 'content',
    label: '测试',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: {} as any,
    propSchema,
    defaultProps: {},
    events: [],
  };
}

describe('PropertyPanel', () => {
  it('renders a text input for string schema', () => {
    const meta = metaOf({ content: { type: 'string', label: '内容' } });
    const w = mount(PropertyPanel, { props: { nodeMeta: meta, modelValue: { content: 'hi' } } });
    const input = w.find('input[type="text"]');
    expect(input.exists()).toBe(true);
    expect((input.element as HTMLInputElement).value).toBe('hi');
  });

  it('renders a checkbox for boolean schema', () => {
    const meta = metaOf({ disabled: { type: 'boolean', label: '禁用' } });
    const w = mount(PropertyPanel, { props: { nodeMeta: meta, modelValue: { disabled: true } } });
    expect(w.find('input[type="checkbox"]').exists()).toBe(true);
  });

  it('renders a select for select schema with options', () => {
    const meta = metaOf({
      size: { type: 'select', label: '尺寸', options: [
        { label: '小', value: 'small' }, { label: '大', value: 'large' },
      ] },
    });
    const w = mount(PropertyPanel, { props: { nodeMeta: meta, modelValue: { size: 'small' } } });
    const select = w.find('select');
    expect(select.exists()).toBe(true);
    expect(select.findAll('option')).toHaveLength(2);
  });

  it('emits update:modelValue with a patch when text input changes', async () => {
    const meta = metaOf({ content: { type: 'string', label: '内容' } });
    // 用父组件 v-model 监听 patch（绕过 emitted 捕获问题）
    const received = ref<Record<string, unknown>>({ content: 'hi' });
    const Parent = defineComponent({
      setup() {
        return () => h(PropertyPanel, {
          nodeMeta: meta,
          modelValue: received.value,
          'onUpdate:modelValue': (patch: Record<string, unknown>) => { received.value = { ...received.value, ...patch }; },
        });
      },
    });
    const w = mount(Parent);
    await w.find('input[type="text"]').setValue('changed');
    expect((received.value as Record<string, unknown>).content).toBe('changed');
  });

  it('shows required asterisk for required fields', () => {
    const meta = metaOf({ formId: { type: 'string', label: '关联表单', required: true } });
    const w = mount(PropertyPanel, { props: { nodeMeta: meta, modelValue: {} } });
    expect(w.find('.lb-property-field__label--required').exists()).toBe(true);
  });

  it('renders empty state when propSchema is empty', () => {
    const meta = metaOf({});
    const w = mount(PropertyPanel, { props: { nodeMeta: meta, modelValue: {} } });
    expect(w.find('.lb-property-panel__empty').exists()).toBe(true);
  });

  it('options editor can add a row', async () => {
    const meta = metaOf({ options: { type: 'options', label: '选项' } });
    const received = ref<Record<string, unknown>>({ options: [] });
    const Parent = defineComponent({
      setup() {
        return () => h(PropertyPanel, {
          nodeMeta: meta,
          modelValue: received.value,
          'onUpdate:modelValue': (patch: Record<string, unknown>) => { received.value = { ...received.value, ...patch }; },
        });
      },
    });
    const w = mount(Parent);
    await w.find('.lb-property-options__add').trigger('click');
    const last = received.value as { options: unknown[] };
    expect(last.options).toHaveLength(1);
  });
});
