/**
 * 组件变体预设（snippets）—— T-ui-10。
 *
 * 与「页面模板 templates.ts」（整页 PageSchema）不同，snippet 是「单组件的预配置变体」：
 * 同一个 LubanButton 可以有「主按钮」「次按钮」「块级按钮」等多个 snippet，
 * 设计师从面板拖入 snippet 即得到预填 props 的节点，省去逐项配置。
 *
 * 数据模型：snippet 只声明 props 覆盖 + 可选子节点，type 仍指向基础物料。
 * 消费侧（ComponentPanel / LubanDesigner add-node）拿到 snippetId 后，
 * 从 SNIPPETS 查表，把 propsOverride 合并进新建节点的 props。
 *
 * 首批覆盖高频组件（Button/Card/Heading/Image/Form）；后续产品可按需扩展，
 * 无需改动框架代码（只需往 SNIPPETS 加条目）。
 */

import type { NodeSchema } from './schema';

/** 一个组件变体预设 */
export interface Snippet {
  /** 唯一 id（type-variant 形式，便于记忆与去重） */
  id: string;
  /** 对应的基础物料 type（如 LubanButton） */
  type: string;
  /** 变体展示名（如「主按钮」） */
  name: string;
  /** 简短描述（hover 提示） */
  description?: string;
  /** 预配置 props 覆盖（与基础物料的 propsSchema 合并） */
  propsOverride: Record<string, unknown>;
  /** 可选：预置子节点（如带头图卡片 = 图 + 文） */
  children?: NodeSchema[];
}

/**
 * 全部 snippet 清单（首批高频组件变体）。
 * 扩展原则：每条 snippet 应「开箱即用」——拖入即得到可用的、有意义的配置，
 * 而非需要二次修改的半成品。
 */
export const SNIPPETS: Snippet[] = [
  // ===== LubanButton 变体 =====
  {
    id: 'LubanButton-primary',
    type: 'LubanButton',
    name: '主按钮',
    description: '实心主色按钮，用于主要操作',
    propsOverride: { content: '确定', variant: 'contained', color: 'primary' },
  },
  {
    id: 'LubanButton-secondary',
    type: 'LubanButton',
    name: '次按钮',
    description: '描边次色按钮，用于次要操作',
    propsOverride: { content: '取消', variant: 'outlined', color: 'secondary' },
  },
  {
    id: 'LubanButton-block',
    type: 'LubanButton',
    name: '块级按钮',
    description: '宽度 100% 的按钮，常用于表单提交',
    propsOverride: { content: '提交', variant: 'contained', color: 'primary', block: true },
  },
  // ===== LubanHeading 变体 =====
  {
    id: 'LubanHeading-h1',
    type: 'LubanHeading',
    name: '一级标题',
    description: 'H1 页面主标题',
    propsOverride: { level: 1, content: '页面标题' },
  },
  {
    id: 'LubanHeading-h2',
    type: 'LubanHeading',
    name: '二级标题',
    description: 'H2 区块标题',
    propsOverride: { level: 2, content: '区块标题' },
  },
  // ===== LubanImage 变体 =====
  {
    id: 'LubanImage-cover',
    type: 'LubanImage',
    name: '封面图',
    description: '宽度撑满、cover 裁切的封面图',
    propsOverride: { src: '', alt: '封面', objectFit: 'cover', width: '100%', height: 240 },
  },
  {
    id: 'LubanImage-avatar',
    type: 'LubanImage',
    name: '头像',
    description: '圆形头像图',
    propsOverride: { src: '', alt: '头像', objectFit: 'cover', width: 64, height: 64 },
  },
  // ===== LubanCard 变体 =====
  {
    id: 'LubanCard-basic',
    type: 'LubanCard',
    name: '基础卡片',
    description: '标题 + 描述的标准卡片',
    propsOverride: { title: '卡片标题', description: '卡片描述内容' },
  },
  {
    id: 'LubanCard-image',
    type: 'LubanCard',
    name: '图文卡片',
    description: '带配图的卡片',
    propsOverride: { title: '卡片标题', description: '卡片描述', src: '', href: '' },
  },
  // ===== LubanForm 变体 =====
  {
    id: 'LubanForm-contact',
    type: 'LubanForm',
    name: '联系表单',
    description: '姓名 + 手机号 + 提交的标准联系表单',
    propsOverride: {},
    children: [
      { id: 'snip-name', type: 'LubanInput', props: { label: '姓名', name: 'name', placeholder: '请输入姓名', required: true } },
      { id: 'snip-phone', type: 'LubanPhoneInput', props: { label: '手机号', name: 'phone', placeholder: '请输入手机号', required: true } },
      { id: 'snip-submit', type: 'LubanButton', props: { content: '提交', variant: 'contained', color: 'primary', block: true, type: 'submit' } },
    ],
  },
];

/** 按 type 检索其全部变体（供 ComponentPanel 分组展示） */
export function getSnippetsByType(type: string): Snippet[] {
  return SNIPPETS.filter((s) => s.type === type);
}

/** 按 id 检索单个 snippet（供 add-node 链路查表） */
export function getSnippetById(id: string): Snippet | undefined {
  return SNIPPETS.find((s) => s.id === id);
}

/** 哪些 type 有变体（供 ComponentPanel 决定是否展示「变体」入口） */
export const SNIPPET_TYPES: Set<string> = new Set(SNIPPETS.map((s) => s.type));
