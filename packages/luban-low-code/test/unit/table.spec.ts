/**
 * LubanTable 物料单测（data-display/table）。
 *
 * 覆盖：
 *  1. propsSchema 契约（字段、类型、默认值、enum）；
 *  2. defineMaterial 不抛错且 name/version/category 正确；
 *  3. 组件渲染（表头、数据行、空态、斑马纹、边框 class、列宽）；
 *  4. rowClick 事件触发与 payload。
 *
 * @since 1.0.0
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { tableMaterial } from '../../src/materials/data-display/table/material';
import LubanTable from '../../src/materials/data-display/table/LubanTable.vue';

describe('tableMaterial (LubanTable) — props schema contract', () => {
  it('declares identity fields correctly', () => {
    expect(tableMaterial.name).toBe('LubanTable');
    expect(tableMaterial.version).toBe('1.0.0');
    expect(tableMaterial.category).toBe('data-display');
  });

  it('declares all required props with defaults', () => {
    const props = tableMaterial.propsSchema.properties;
    for (const key of ['columns', 'datasourceId', 'pageSize', 'striped', 'border']) {
      expect(props[key]).toBeDefined();
      expect(props[key]!.default).not.toBeUndefined();
    }
  });

  it('columns is an array of { label, key, width? }', () => {
    const cols = tableMaterial.propsSchema.properties.columns;
    expect(cols!.type).toBe('array');
    expect(cols!.items?.type).toBe('object');
    const itemProps = cols!.items!.properties!;
    expect(itemProps.label.type).toBe('string');
    expect(itemProps.key.type).toBe('string');
    expect(itemProps.width).toBeDefined();
  });

  it('defaults match spec (pageSize 10 / striped false / border true)', () => {
    const p = tableMaterial.propsSchema.properties;
    expect(p.pageSize!.default).toBe(10);
    expect(p.striped!.default).toBe(false);
    expect(p.border!.default).toBe(true);
    expect(p.datasourceId!.default).toBe('');
    expect(p.columns!.default).toEqual([]);
  });

  it('declares rowClick event and empty slot', () => {
    const events = tableMaterial.events!.map((e) => e.name);
    expect(events).toContain('rowClick');
    const slots = tableMaterial.slots!.map((s) => s.name);
    expect(slots).toContain('empty');
  });
});

describe('LubanTable component — rendering', () => {
  const columns = [
    { label: '名称', key: 'name' },
    { label: '年龄', key: 'age', width: 80 },
  ];
  const rows = [
    { name: '张三', age: 20 },
    { name: '李四', age: 30 },
  ];

  it('renders headers from columns', () => {
    const wrapper = mount(LubanTable, { props: { columns, rows: [] } });
    const ths = wrapper.findAll('.lb-table__th');
    expect(ths).toHaveLength(2);
    expect(ths[0].text()).toBe('名称');
    expect(ths[1].text()).toBe('年龄');
  });

  it('renders data rows and cells', () => {
    const wrapper = mount(LubanTable, { props: { columns, rows } });
    const trs = wrapper.findAll('.lb-table__row');
    expect(trs).toHaveLength(2);
    const firstRowTds = trs[0].findAll('.lb-table__td');
    expect(firstRowTds[0].text()).toBe('张三');
    expect(firstRowTds[1].text()).toBe('20');
  });

  it('shows empty slot content when rows is empty', () => {
    const wrapper = mount(LubanTable, {
      props: { columns, rows: [] },
      slots: { empty: '<span class="no-data">暂无数据</span>' },
    });
    expect(wrapper.find('.no-data').exists()).toBe(true);
    expect(wrapper.find('.lb-table__empty').exists()).toBe(true);
  });

  it('applies striped class to odd rows when striped=true', () => {
    const wrapper = mount(LubanTable, {
      props: { columns, rows, striped: true },
    });
    const rows1 = wrapper.findAll('.lb-table__row');
    expect(rows1[1].classes()).toContain('lb-table__row--striped');
    expect(rows1[0].classes()).not.toContain('lb-table__row--striped');
  });

  it('applies border wrapper class when border=true (default)', () => {
    const wrapper = mount(LubanTable, { props: { columns, rows } });
    expect(wrapper.find('.lb-table').classes()).toContain('lb-table--border');
  });

  it('does not apply border class when border=false', () => {
    const wrapper = mount(LubanTable, {
      props: { columns, rows, border: false },
    });
    expect(wrapper.find('.lb-table').classes()).not.toContain('lb-table--border');
  });

  it('emits rowClick with the clicked row payload', async () => {
    const wrapper = mount(LubanTable, { props: { columns, rows } });
    await wrapper.findAll('.lb-table__row')[0].trigger('click');
    expect(wrapper.emitted('rowClick')).toBeTruthy();
    expect(wrapper.emitted('rowClick')![0][0]).toEqual(rows[0]);
  });

  it('renders column width style for numeric width (px)', () => {
    const wrapper = mount(LubanTable, { props: { columns, rows: [] } });
    const ths = wrapper.findAll('.lb-table__th');
    expect(ths[1].attributes('style')).toContain('width: 80px');
  });
});
