/**
 * Validation rules for form fields. All fields are optional; each rule type has its own message.
 * Designer can configure these in node.props.rules (JSON-serializable).
 */
export interface ValidationRule {
  /** Required field */
  required?: boolean;
  /** Built-in type: email, tel, url, number (for string inputs) */
  type?: 'email' | 'tel' | 'url' | 'number';
  /** Min string length */
  minLength?: number;
  /** Max string length */
  maxLength?: number;
  /** Min number value */
  min?: number;
  /** Max number value */
  max?: number;
  /** Regex pattern (string source, e.g. "^[a-z]+$") */
  pattern?: string;
  /** Error message for this rule when it fails */
  message?: string;
}

import type { NodeSchema, PageSchema } from './schema';
import { FORM_VALUE_TYPES, BOOLEAN_FORM_VALUE_TYPES } from './constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^[\d\s\-+()]+$/;
const URL_RE = /^https?:\/\/.+/;

function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'number') return Number.isNaN(value);
  return false;
}

/** For checkbox/switch: required means value must be true */
function isRequiredButUnchecked(rule: ValidationRule, value: unknown): boolean {
  return !!(rule.required && typeof value === 'boolean' && !value);
}

/**
 * Run validation rules against a value. Returns the first error message or null if valid.
 */
export function validate(value: unknown, rules: ValidationRule[] | undefined): string | null {
  if (!rules?.length) return null;

  const str = value != null ? String(value).trim() : '';
  const num = typeof value === 'number' ? value : Number(value);

  for (const rule of rules) {
    // required (string/number/null/undefined)
    if (rule.required && isEmpty(value)) {
      return rule.message ?? '必填';
    }
    // required for checkbox/switch: must be checked
    if (isRequiredButUnchecked(rule, value)) {
      return rule.message ?? '必填';
    }
    // if empty and not required, skip other rules (optional field)
    if (isEmpty(value) && !rule.required) continue;

    // type
    if (rule.type) {
      if (rule.type === 'email' && !EMAIL_RE.test(str)) {
        return rule.message ?? '请输入有效的邮箱地址';
      }
      if (rule.type === 'tel' && !TEL_RE.test(str)) {
        return rule.message ?? '请输入有效的电话号码';
      }
      if (rule.type === 'url' && !URL_RE.test(str)) {
        return rule.message ?? '请输入有效的 URL';
      }
      if (rule.type === 'number' && str !== '' && Number.isNaN(num)) {
        return rule.message ?? '请输入有效数字';
      }
    }

    // minLength / maxLength (string)
    if (rule.minLength != null && str.length < rule.minLength) {
      return rule.message ?? `至少 ${rule.minLength} 个字符`;
    }
    if (rule.maxLength != null && str.length > rule.maxLength) {
      return rule.message ?? `最多 ${rule.maxLength} 个字符`;
    }

    // min / max (number)
    if (rule.min != null && typeof value === 'number' && value < rule.min) {
      return rule.message ?? `不能小于 ${rule.min}`;
    }
    if (rule.max != null && typeof value === 'number' && value > rule.max) {
      return rule.message ?? `不能大于 ${rule.max}`;
    }
    if (rule.min != null && (typeof value === 'string' || typeof value === 'number')) {
      const n = typeof value === 'number' ? value : Number(value);
      if (!Number.isNaN(n) && n < rule.min!) {
        return rule.message ?? `不能小于 ${rule.min}`;
      }
    }
    if (rule.max != null && (typeof value === 'string' || typeof value === 'number')) {
      const n = typeof value === 'number' ? value : Number(value);
      if (!Number.isNaN(n) && n > rule.max!) {
        return rule.message ?? `不能大于 ${rule.max}`;
      }
    }

    // pattern
    if (rule.pattern) {
      try {
        const re = new RegExp(rule.pattern);
        if (!re.test(str)) {
          return rule.message ?? '格式不正确';
        }
      } catch {
        // invalid regex, skip
      }
    }
  }

  return null;
}

// ---- 全表单校验 + formState 初始化（T-ui-3）----

/** 深度优先遍历 schema 节点（含 children 递归）。 */
function walkNodes(node: NodeSchema | undefined, cb: (n: NodeSchema) => void): void {
  if (!node) return;
  cb(node);
  if (node.children?.length) {
    for (const child of node.children) walkNodes(child, cb);
  }
}

/**
 * 初始化整页表单状态：遍历 schema.root，对每个表单值节点按类型生成默认值。
 * 键为节点 id（与 validateAll 对齐）。
 * 复合类型（数组/对象）按组件类型给正确的空值（修复 initFormState 🔴）。
 */
const ARRAY_FORM_VALUE_TYPES = new Set<string>(['LubanTagInput']);
const OBJECT_FORM_VALUE_TYPES = new Set<string>([
  'LubanDateRange',
  'LubanRegionSelect',
]);
const NUMBER_FORM_VALUE_TYPES = new Set<string>(['LubanRating', 'LubanSlider']);

export function initFormState(schema: PageSchema): Record<string, unknown> {
  const state: Record<string, unknown> = {};
  walkNodes(schema.root, (n) => {
    if (!FORM_VALUE_TYPES.has(n.type)) return;
    const v = n.props?.value;
    if (BOOLEAN_FORM_VALUE_TYPES.has(n.type)) {
      state[n.id] = false;
    } else if (ARRAY_FORM_VALUE_TYPES.has(n.type)) {
      state[n.id] = v != null ? v : [];
    } else if (OBJECT_FORM_VALUE_TYPES.has(n.type)) {
      if (n.type === 'LubanDateRange') {
        const dv = v as { start?: string; end?: string } | undefined;
        state[n.id] = { start: dv?.start ?? '', end: dv?.end ?? '' };
      } else {
        state[n.id] = v != null ? v : {};
      }
    } else if (NUMBER_FORM_VALUE_TYPES.has(n.type)) {
      state[n.id] = v != null ? v : 0;
    } else {
      state[n.id] = v != null ? v : '';
    }
  });
  return state;
}

/**
 * 全表单提交校验：遍历 schema.root，对每个带 rules 的表单值节点执行 validate，
 * 返回 { [nodeId]: errorMessage }（空对象表示全部通过）。
 */
export function validateAll(
  schema: PageSchema,
  formState: Record<string, unknown>
): Record<string, string> {
  const errors: Record<string, string> = {};
  walkNodes(schema.root, (n) => {
    if (!FORM_VALUE_TYPES.has(n.type)) return;
    const rules = n.props?.rules;
    if (!Array.isArray(rules) || rules.length === 0) return; // 无规则跳过
    const value = formState[n.id];
    const msg = validate(value, rules as ValidationRule[]);
    if (msg) errors[n.id] = msg;
  });
  return errors;
}
