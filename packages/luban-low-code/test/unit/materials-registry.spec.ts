import { describe, it, expect } from 'vitest';
import {
  getPaletteGroups,
  getPaletteItems,
  isPaletteType,
} from '../../src/lib/palette';
import {
  getComponentMeta,
  getAllComponentMeta,
} from '../../src/lib/componentMeta';

/**
 * T-ui-12/13: 验证全量物料注册 + 面板分组 + componentMeta 完整性。
 * 不依赖 DOM 事件（规避环境工具链问题），纯数据层断言。
 */
describe('materials registry (T-ui-12/13)', () => {
  const NEW_TYPES = [
    // 营销
    'LubanCountdown',
    'LubanCoupon',
    'LubanModal',
    'LubanCarousel',
    'LubanNavBar',
    'LubanFooter',
    // 网站
    'LubanImage',
    'LubanHeading',
    'LubanLink',
    'LubanCard',
    'LubanDivider',
    'LubanIcon',
    'LubanList',
    'LubanRichText',
    'LubanVideo',
    'LubanTabs',
    'LubanCollapse',
    // 留资
    'LubanPhoneInput',
    'LubanRegionSelect',
    'LubanDatePicker',
    'LubanFileUpload',
    'LubanRating',
    'LubanSlider',
    // 海报
    'LubanPoster',
    'LubanPosterText',
    'LubanPosterImage',
    'LubanShape',
    'LubanQRCode',
    // 表单补全
    'LubanDateRange',
    'LubanTimePicker',
    'LubanTagInput',
  ];

  it('all new material types are in palette', () => {
    for (const type of NEW_TYPES) {
      expect(isPaletteType(type)).toBe(true);
    }
  });

  it('palette has 5 categories including 营销/网站/海报', () => {
    const groups = getPaletteGroups();
    const cats = groups.map((g) => g.category);
    expect(cats).toContain('营销');
    expect(cats).toContain('网站');
    expect(cats).toContain('海报');
    // 营销族 6 项
    const marketing = groups.find((g) => g.category === '营销');
    expect(marketing?.items).toHaveLength(6);
    // 网站族 11 项
    const website = groups.find((g) => g.category === '网站');
    expect(website?.items).toHaveLength(11);
  });

  it('getPaletteItems covers all 40+ materials', () => {
    const items = getPaletteItems();
    // 基础 13 + 新增 31 = 44
    expect(items.length).toBeGreaterThanOrEqual(44);
  });

  it('every palette type has componentMeta with propSchema', () => {
    const items = getPaletteItems();
    for (const item of items) {
      const meta = getComponentMeta(item.type);
      expect(meta, `meta missing for ${item.type}`).toBeDefined();
      expect(meta!.label).toBe(item.label);
      expect(meta!.propSchema).toBeDefined();
    }
  });

  it('LubanForm has full propSchema (T-ui-4)', () => {
    const meta = getComponentMeta('LubanForm');
    expect(meta?.propSchema.formId).toBeDefined();
    expect(meta?.propSchema.submitConfig).toBeDefined();
    expect(meta?.propSchema.size).toBeDefined();
  });

  it('LubanPoster is a container', () => {
    const meta = getComponentMeta('LubanPoster');
    expect(meta?.isContainer).toBe(true);
  });

  it('getAllComponentMeta returns all registered', () => {
    const all = getAllComponentMeta();
    expect(all.length).toBeGreaterThanOrEqual(44);
  });
});
