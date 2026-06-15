import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
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
    const w = mount(PropertyPanel, { props: { nodeMeta: meta, modelValue: { content: 'hi' } } });
    const input = w.find('input[type="text"]');
    expect(input.exists()).toBe(true);
    await input.setValue('changed');
    await w.vm.$nextTick();
    const events = w.emitted('update:modelValue');
    expect(events).toBeTruthy();
    expect((events![events!.length - 1][0] as Record<string, unknown>).content).toBe('changed');
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
    const w = mount(PropertyPanel, { props: { nodeMeta: meta, modelValue: { options: [] } } });
    const addBtn = w.find('.lb-property-options__add');
    expect(addBtn.exists()).toBe(true);
    await addBtn.trigger('click');
    await w.vm.$nextTick();
    const events = w.emitted('update:modelValue');
    expect(events).toBeTruthy();
    const last = events![events!.length - 1][0] as { options: unknown[] };
    expect(last.options).toHaveLength(1);
  });
});
