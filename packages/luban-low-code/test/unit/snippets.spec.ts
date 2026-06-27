import { describe, it, expect } from 'vitest';
import { SNIPPETS, getSnippetsByType, getSnippetById, SNIPPET_TYPES } from '../../src/lib/snippets';

/**
 * T-ui-10 snippets 单测：验证变体预设数据结构与查表函数。
 */
describe('snippets (T-ui-10)', () => {
  it('每个 snippet 有完整字段（id/type/name/propsOverride）', () => {
    expect(SNIPPETS.length).toBeGreaterThan(0);
    for (const s of SNIPPETS) {
      expect(s.id).toBeTruthy();
      expect(s.type).toMatch(/^Luban[A-Z]/);
      expect(s.name).toBeTruthy();
      expect(typeof s.propsOverride).toBe('object');
    }
  });

  it('每个 snippet id 唯一', () => {
    const ids = SNIPPETS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getSnippetsByType 返回该 type 的全部变体', () => {
    const buttonSnippets = getSnippetsByType('LubanButton');
    expect(buttonSnippets.length).toBeGreaterThanOrEqual(2);
    expect(buttonSnippets.every((s) => s.type === 'LubanButton')).toBe(true);
  });

  it('getSnippetsByType 对无变体的 type 返回空数组', () => {
    expect(getSnippetsByType('LubanContainer')).toEqual([]);
  });

  it('getSnippetById 命中返回 snippet', () => {
    const first = SNIPPETS[0];
    expect(getSnippetById(first.id)?.id).toBe(first.id);
  });

  it('getSnippetById 未命中返回 undefined', () => {
    expect(getSnippetById('non-existent')).toBeUndefined();
  });

  it('SNIPPET_TYPES 包含所有有变体的 type', () => {
    const typesFromSnippets = new Set(SNIPPETS.map((s) => s.type));
    expect(SNIPPET_TYPES).toEqual(typesFromSnippets);
  });

  it('联系表单变体含预置子节点', () => {
    const contactForm = getSnippetById('LubanForm-contact');
    expect(contactForm).toBeDefined();
    expect(contactForm?.children?.length).toBeGreaterThan(0);
    // 子节点应有 type（如 LubanInput/LubanPhoneInput/LubanButton）
    expect(contactForm?.children?.every((c) => c.type.startsWith('Luban'))).toBe(true);
  });
});
