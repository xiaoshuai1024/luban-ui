import type { Component } from 'vue';
import { getComponent } from './registry';

/**
 * Schema for a single prop (for property panel and validation).
 * 支持基础类型 + 样式/自定义设置器类型（设计器升级 T-ui-d24）。
 */
export interface PropSchemaItem {
  type: 'string' | 'number' | 'boolean' | 'select' | 'json' | 'options'
      | 'color' | 'spacing' | 'image' | 'richtext' | 'custom';
  default?: unknown;
  required?: boolean;
  /** For select: { label: string; value: string | number }[] */
  options?: { label: string; value: string | number }[];
  label?: string;
  /** 自定义设置器名（优先于 type 渲染） */
  setter?: string;
  /** 分组标签（'基础' | '样式' | '事件' | '高级'） */
  group?: string;
  /** placeholder 提示文本 */
  placeholder?: string;
  /** 对于 spacing 类型：指定方向 ('all' | 'horizontal' | 'vertical' | 'top' | 'right' | 'bottom' | 'left') */
  direction?: string;
}

export type PropSchema = Record<string, PropSchemaItem>;

/**
 * Component metadata for design-time: property panel, default props, and drop rules.
 */
export interface ComponentMeta {
  type: string;
  category: 'layout' | 'form' | 'content' | 'button' | 'marketing' | 'website' | 'poster';
  label: string;
  component: Component;
  propSchema: PropSchema;
  /** 样式属性 schema（设计器升级，样式面板消费） */
  styleSchema?: PropSchema;
  defaultProps: Record<string, unknown>;
  events: string[];
  /** If true, this component can accept child nodes (drop zone). */
  isContainer?: boolean;
  /** Allowed child types when isContainer; empty = any registered. */
  acceptTypes?: string[];
  /** 物料图标（emoji 或图标类名，用于组件面板） */
  icon?: string;
}

const metaByType: Record<string, ComponentMeta> = {};

function registerMeta(meta: ComponentMeta): void {
  metaByType[meta.type] = meta;
}

function buildDefaultMeta(): void {
  const comp = (t: string) => getComponent(t)!;
  registerMeta({
    type: 'LubanButton',
    category: 'button',
    label: '按钮',
    component: comp('LubanButton'),
    propSchema: {
      content: { type: 'string', label: '文案', default: '按钮' },
      variant: {
        type: 'select',
        label: '变体',
        default: 'contained',
        options: [
          { label: '实心', value: 'contained' },
          { label: '描边', value: 'outlined' },
          { label: '文本', value: 'text' },
        ],
      },
      color: {
        type: 'select',
        label: '颜色',
        default: 'primary',
        options: [
          { label: '主色', value: 'primary' },
          { label: '次色', value: 'secondary' },
          { label: '表面', value: 'surface' },
        ],
      },
      disabled: { type: 'boolean', label: '禁用', default: false },
      block: { type: 'boolean', label: '块级', default: false },
    },
    defaultProps: { content: '按钮', variant: 'contained', color: 'primary' },
    events: ['click'],
  });

  registerMeta({
    type: 'LubanContainer',
    category: 'layout',
    label: '容器',
    component: comp('LubanContainer'),
    isContainer: true,
    propSchema: {
      maxWidth: {
        type: 'select',
        label: '最大宽度',
        default: 'lg',
        options: [
          { label: 'sm', value: 'sm' },
          { label: 'md', value: 'md' },
          { label: 'lg', value: 'lg' },
          { label: 'xl', value: 'xl' },
          { label: 'full', value: 'full' },
        ],
      },
      padded: { type: 'boolean', label: '内边距', default: true },
    },
    defaultProps: { maxWidth: 'md', padded: true },
    events: [],
  });

  registerMeta({
    type: 'LubanRow',
    category: 'layout',
    label: '行',
    component: comp('LubanRow'),
    isContainer: true,
    propSchema: {
      gap: { type: 'number', label: '间距', default: 16 },
      align: {
        type: 'select',
        label: '垂直对齐',
        default: 'stretch',
        options: [
          { label: 'start', value: 'start' },
          { label: 'center', value: 'center' },
          { label: 'end', value: 'end' },
          { label: 'stretch', value: 'stretch' },
        ],
      },
      justify: {
        type: 'select',
        label: '水平对齐',
        default: 'start',
        options: [
          { label: 'start', value: 'start' },
          { label: 'center', value: 'center' },
          { label: 'end', value: 'end' },
          { label: 'between', value: 'between' },
          { label: 'around', value: 'around' },
        ],
      },
    },
    defaultProps: { gap: 16 },
    events: [],
  });

  registerMeta({
    type: 'LubanCol',
    category: 'layout',
    label: '列',
    component: comp('LubanCol'),
    isContainer: true,
    propSchema: {
      basis: { type: 'number', label: '基础宽度(%)', default: 50 },
      grow: { type: 'number', label: 'flex-grow', default: 1 },
    },
    defaultProps: { basis: 50 },
    events: [],
  });

  const FORM_CONTROL_TYPES = [
    'LubanInput',
    'LubanTextArea',
    'LubanSelect',
    'LubanCheckbox',
    'LubanRadioGroup',
    'LubanSwitch',
  ];
  registerMeta({
    type: 'LubanForm',
    category: 'form',
    label: '表单',
    component: comp('LubanForm'),
    isContainer: true,
    acceptTypes: FORM_CONTROL_TYPES,
    propSchema: {
      formId: { type: 'string', label: '关联表单ID', required: true },
      submitConfig: {
        type: 'json',
        label: '提交配置',
        default: { mode: 'toast', toastMessage: '提交成功' },
      },
      size: {
        type: 'select',
        label: '尺寸',
        default: 'medium',
        options: [
          { label: '小', value: 'small' },
          { label: '中', value: 'medium' },
          { label: '大', value: 'large' },
        ],
      },
    },
    defaultProps: {
      formId: '',
      submitConfig: { mode: 'toast', toastMessage: '提交成功' },
      size: 'medium',
    },
    events: ['submit'],
  });

  registerMeta({
    type: 'LubanInput',
    category: 'form',
    label: '输入框',
    component: comp('LubanInput'),
    propSchema: {
      name: { type: 'string', label: '字段名' },
      label: { type: 'string', label: '标签', default: '输入框' },
      placeholder: { type: 'string', label: '占位' },
      type: {
        type: 'select',
        label: '类型',
        default: 'text',
        options: [
          { label: '文本', value: 'text' },
          { label: '邮箱', value: 'email' },
          { label: '电话', value: 'tel' },
          { label: '数字', value: 'number' },
          { label: '密码', value: 'password' },
        ],
      },
      required: { type: 'boolean', label: '必填', default: false },
      disabled: { type: 'boolean', label: '禁用', default: false },
    },
    defaultProps: { label: '输入框', placeholder: '请输入' },
    events: ['update:modelValue', 'blur', 'focus'],
  });

  registerMeta({
    type: 'LubanTextArea',
    category: 'form',
    label: '多行文本',
    component: comp('LubanTextArea'),
    propSchema: {
      name: { type: 'string', label: '字段名' },
      label: { type: 'string', label: '标签', default: '多行文本' },
      placeholder: { type: 'string', label: '占位' },
      rows: { type: 'number', label: '行数', default: 3 },
      required: { type: 'boolean', label: '必填', default: false },
      disabled: { type: 'boolean', label: '禁用', default: false },
    },
    defaultProps: { label: '多行文本', rows: 3 },
    events: ['update:modelValue', 'blur', 'focus'],
  });

  registerMeta({
    type: 'LubanSelect',
    category: 'form',
    label: '选择',
    component: comp('LubanSelect'),
    propSchema: {
      name: { type: 'string', label: '字段名' },
      label: { type: 'string', label: '标签', default: '选择' },
      placeholder: { type: 'string', label: '占位', default: '请选择' },
      options: { type: 'options', label: '选项', default: [] },
      required: { type: 'boolean', label: '必填', default: false },
      disabled: { type: 'boolean', label: '禁用', default: false },
    },
    defaultProps: { label: '选择', placeholder: '请选择', options: [] },
    events: ['update:modelValue', 'blur', 'focus'],
  });

  registerMeta({
    type: 'LubanCheckbox',
    category: 'form',
    label: '复选框',
    component: comp('LubanCheckbox'),
    propSchema: {
      name: { type: 'string', label: '字段名' },
      label: { type: 'string', label: '标签', default: '复选框' },
      required: { type: 'boolean', label: '必填', default: false },
      disabled: { type: 'boolean', label: '禁用', default: false },
    },
    defaultProps: { label: '复选框' },
    events: ['update:modelValue'],
  });

  registerMeta({
    type: 'LubanRadioGroup',
    category: 'form',
    label: '单选',
    component: comp('LubanRadioGroup'),
    propSchema: {
      name: { type: 'string', label: '字段名' },
      label: { type: 'string', label: '标签', default: '单选' },
      options: { type: 'options', label: '选项', default: [] },
      required: { type: 'boolean', label: '必填', default: false },
      disabled: { type: 'boolean', label: '禁用', default: false },
    },
    defaultProps: { label: '单选', options: [] },
    events: ['update:modelValue'],
  });

  registerMeta({
    type: 'LubanSwitch',
    category: 'form',
    label: '开关',
    component: comp('LubanSwitch'),
    propSchema: {
      name: { type: 'string', label: '字段名' },
      label: { type: 'string', label: '标签', default: '开关' },
      disabled: { type: 'boolean', label: '禁用', default: false },
    },
    defaultProps: { label: '开关' },
    events: ['update:modelValue'],
  });

  registerMeta({
    type: 'LubanBanner',
    category: 'content',
    label: '横幅',
    component: comp('LubanBanner'),
    propSchema: {
      content: { type: 'string', label: '内容' },
    },
    defaultProps: {},
    events: [],
  });

  registerMeta({
    type: 'LubanText',
    category: 'content',
    label: '文本',
    component: comp('LubanText'),
    propSchema: {
      content: { type: 'string', label: '内容' },
    },
    defaultProps: {},
    events: [],
  });

  // ---- 新增物料族元数据（T-ui-7~11）----

  // 营销族
  registerMeta({
    type: 'LubanCountdown', category: 'content', label: '倒计时', component: comp('LubanCountdown'),
    propSchema: { deadline: { type: 'string', label: '截止时间', required: true }, label: { type: 'string', label: '文案', default: '距离结束' } },
    defaultProps: { deadline: '', label: '距离结束' }, events: [],
  });
  registerMeta({
    type: 'LubanCoupon', category: 'content', label: '优惠券卡', component: comp('LubanCoupon'),
    propSchema: { code: { type: 'string', label: '优惠码', required: true }, discount: { type: 'string', label: '折扣', required: true }, title: { type: 'string', label: '标题', default: '优惠券' }, description: { type: 'string', label: '描述' } },
    defaultProps: { code: '', discount: '', title: '优惠券' }, events: ['copy'],
  });
  registerMeta({
    type: 'LubanModal', category: 'content', label: '弹窗', component: comp('LubanModal'),
    propSchema: { visible: { type: 'boolean', label: '可见', default: false }, title: { type: 'string', label: '标题' }, trigger: { type: 'string', label: '触发按钮文案' } },
    defaultProps: { visible: false }, events: ['update:visible', 'open', 'close'],
  });
  registerMeta({
    type: 'LubanCarousel', category: 'content', label: '轮播图', component: comp('LubanCarousel'),
    propSchema: { slides: { type: 'json', label: '轮播项', default: [] }, interval: { type: 'number', label: '间隔(ms)', default: 4000 } },
    defaultProps: { slides: [], interval: 4000 }, events: [],
  });
  registerMeta({
    type: 'LubanNavBar', category: 'content', label: '导航栏', component: comp('LubanNavBar'),
    propSchema: { brand: { type: 'string', label: '品牌名' }, links: { type: 'json', label: '链接列表', default: [] } },
    defaultProps: { brand: '', links: [] }, events: [],
  });
  registerMeta({
    type: 'LubanFooter', category: 'content', label: '页脚', component: comp('LubanFooter'),
    propSchema: { copyright: { type: 'string', label: '版权' }, links: { type: 'json', label: '链接列表', default: [] } },
    defaultProps: { copyright: '', links: [] }, events: [],
  });

  // 网站族
  registerMeta({
    type: 'LubanImage', category: 'content', label: '图片', component: comp('LubanImage'),
    propSchema: { src: { type: 'string', label: '图片地址', required: true }, alt: { type: 'string', label: '替代文本' }, width: { type: 'number', label: '宽度' }, height: { type: 'number', label: '高度' }, href: { type: 'string', label: '链接' } },
    defaultProps: { src: '' }, events: [],
  });
  registerMeta({
    type: 'LubanHeading', category: 'content', label: '标题', component: comp('LubanHeading'),
    propSchema: { level: { type: 'select', label: '层级', default: 2, options: [{label:'H1',value:1},{label:'H2',value:2},{label:'H3',value:3},{label:'H4',value:4},{label:'H5',value:5},{label:'H6',value:6}] }, content: { type: 'string', label: '内容' } },
    defaultProps: { level: 2, content: '标题' }, events: [],
  });
  registerMeta({
    type: 'LubanLink', category: 'content', label: '链接', component: comp('LubanLink'),
    propSchema: { href: { type: 'string', label: '地址', required: true }, text: { type: 'string', label: '文案', required: true }, target: { type: 'string', label: '打开方式' } },
    defaultProps: { href: '#', text: '链接' }, events: [],
  });
  registerMeta({
    type: 'LubanCard', category: 'content', label: '卡片', component: comp('LubanCard'),
    propSchema: { title: { type: 'string', label: '标题' }, description: { type: 'string', label: '描述' }, src: { type: 'string', label: '图片' }, href: { type: 'string', label: '链接' } },
    defaultProps: { title: '', description: '' }, events: [],
  });
  registerMeta({
    type: 'LubanDivider', category: 'content', label: '分隔线', component: comp('LubanDivider'),
    propSchema: { variant: { type: 'select', label: '样式', default: 'solid', options: [{label:'实线',value:'solid'},{label:'虚线',value:'dashed'},{label:'点线',value:'dotted'}] } },
    defaultProps: { variant: 'solid' }, events: [],
  });
  registerMeta({
    type: 'LubanIcon', category: 'content', label: '图标', component: comp('LubanIcon'),
    propSchema: { name: { type: 'string', label: '图标', required: true }, size: { type: 'number', label: '尺寸', default: 24 }, color: { type: 'string', label: '颜色' } },
    defaultProps: { name: '★', size: 24 }, events: [],
  });
  registerMeta({
    type: 'LubanList', category: 'content', label: '列表', component: comp('LubanList'),
    propSchema: { items: { type: 'json', label: '列表项', default: [] }, ordered: { type: 'boolean', label: '有序', default: false } },
    defaultProps: { items: [], ordered: false }, events: [],
  });
  registerMeta({
    type: 'LubanRichText', category: 'content', label: '富文本', component: comp('LubanRichText'),
    propSchema: { html: { type: 'json', label: 'HTML 内容', default: '' } },
    defaultProps: { html: '<p>富文本</p>' }, events: [],
  });
  registerMeta({
    type: 'LubanVideo', category: 'content', label: '视频', component: comp('LubanVideo'),
    propSchema: { src: { type: 'string', label: '视频地址', required: true }, poster: { type: 'string', label: '封面' }, controls: { type: 'boolean', label: '控制条', default: true } },
    defaultProps: { src: '', controls: true }, events: [],
  });
  registerMeta({
    type: 'LubanTabs', category: 'content', label: '标签页', component: comp('LubanTabs'),
    propSchema: { tabs: { type: 'json', label: '标签配置', default: [] } },
    defaultProps: { tabs: [] }, events: [],
  });
  registerMeta({
    type: 'LubanCollapse', category: 'content', label: '折叠面板', component: comp('LubanCollapse'),
    propSchema: { panels: { type: 'json', label: '面板配置', default: [] } },
    defaultProps: { panels: [] }, events: [],
  });

  // 留资族
  registerMeta({
    type: 'LubanPhoneInput', category: 'form', label: '手机号', component: comp('LubanPhoneInput'),
    propSchema: { name: { type: 'string', label: '字段名' }, label: { type: 'string', label: '标签', default: '手机号' }, required: { type: 'boolean', label: '必填', default: false } },
    defaultProps: { label: '手机号' }, events: ['update:modelValue'],
  });
  registerMeta({
    type: 'LubanRegionSelect', category: 'form', label: '省市联动', component: comp('LubanRegionSelect'),
    propSchema: { name: { type: 'string', label: '字段名' }, label: { type: 'string', label: '标签', default: '省/市' }, required: { type: 'boolean', label: '必填', default: false } },
    defaultProps: { label: '省/市' }, events: ['update:modelValue'],
  });
  registerMeta({
    type: 'LubanDatePicker', category: 'form', label: '日期选择', component: comp('LubanDatePicker'),
    propSchema: { name: { type: 'string', label: '字段名' }, label: { type: 'string', label: '标签', default: '日期' }, required: { type: 'boolean', label: '必填', default: false } },
    defaultProps: { label: '日期' }, events: ['update:modelValue'],
  });
  registerMeta({
    type: 'LubanFileUpload', category: 'form', label: '文件上传', component: comp('LubanFileUpload'),
    propSchema: { name: { type: 'string', label: '字段名' }, label: { type: 'string', label: '标签', default: '文件上传' }, accept: { type: 'string', label: '允许类型' }, required: { type: 'boolean', label: '必填', default: false } },
    defaultProps: { label: '文件上传', accept: '' }, events: ['update:modelValue'],
  });
  registerMeta({
    type: 'LubanRating', category: 'form', label: '评分', component: comp('LubanRating'),
    propSchema: { name: { type: 'string', label: '字段名' }, label: { type: 'string', label: '标签', default: '评分' }, max: { type: 'number', label: '最大值', default: 5 }, required: { type: 'boolean', label: '必填', default: false } },
    defaultProps: { label: '评分', max: 5 }, events: ['update:modelValue'],
  });
  registerMeta({
    type: 'LubanSlider', category: 'form', label: '滑块', component: comp('LubanSlider'),
    propSchema: { name: { type: 'string', label: '字段名' }, label: { type: 'string', label: '标签', default: '滑块' }, min: { type: 'number', label: '最小值', default: 0 }, max: { type: 'number', label: '最大值', default: 100 }, step: { type: 'number', label: '步长', default: 1 } },
    defaultProps: { label: '滑块', min: 0, max: 100, step: 1 }, events: ['update:modelValue'],
  });

  // 表单补全
  registerMeta({
    type: 'LubanDateRange', category: 'form', label: '日期范围', component: comp('LubanDateRange'),
    propSchema: { name: { type: 'string', label: '字段名' }, label: { type: 'string', label: '标签', default: '日期范围' }, required: { type: 'boolean', label: '必填', default: false } },
    defaultProps: { label: '日期范围' }, events: ['update:modelValue'],
  });
  registerMeta({
    type: 'LubanTimePicker', category: 'form', label: '时间选择', component: comp('LubanTimePicker'),
    propSchema: { name: { type: 'string', label: '字段名' }, label: { type: 'string', label: '标签', default: '时间' }, required: { type: 'boolean', label: '必填', default: false } },
    defaultProps: { label: '时间' }, events: ['update:modelValue'],
  });
  registerMeta({
    type: 'LubanTagInput', category: 'form', label: '标签输入', component: comp('LubanTagInput'),
    propSchema: { name: { type: 'string', label: '字段名' }, label: { type: 'string', label: '标签', default: '标签' }, placeholder: { type: 'string', label: '占位' }, required: { type: 'boolean', label: '必填', default: false } },
    defaultProps: { label: '标签', placeholder: '输入后回车添加' }, events: ['update:modelValue'],
  });

  // 海报族
  registerMeta({
    type: 'LubanPoster', category: 'layout', label: '海报容器', component: comp('LubanPoster'),
    isContainer: true,
    propSchema: { width: { type: 'number', label: '宽度(px)', default: 1080 }, height: { type: 'number', label: '高度(px)', default: 1920 }, background: { type: 'string', label: '背景色', default: '#fff' } },
    defaultProps: { width: 1080, height: 1920, background: '#fff' }, events: [],
  });
  registerMeta({
    type: 'LubanPosterText', category: 'content', label: '海报文本', component: comp('LubanPosterText'),
    propSchema: { content: { type: 'string', label: '内容' }, fontSize: { type: 'number', label: '字号', default: 32 }, color: { type: 'string', label: '颜色', default: '#333' }, bold: { type: 'boolean', label: '加粗', default: false } },
    defaultProps: { content: '文本', fontSize: 32, color: '#333', bold: false }, events: [],
  });
  registerMeta({
    type: 'LubanPosterImage', category: 'content', label: '海报图片', component: comp('LubanPosterImage'),
    propSchema: { src: { type: 'string', label: '图片地址', required: true }, width: { type: 'number', label: '宽度' }, radius: { type: 'number', label: '圆角' } },
    defaultProps: { src: '' }, events: [],
  });
  registerMeta({
    type: 'LubanShape', category: 'content', label: '形状', component: comp('LubanShape'),
    propSchema: { type: { type: 'select', label: '形状', default: 'rect', options: [{label:'矩形',value:'rect'},{label:'圆形',value:'circle'}] }, color: { type: 'string', label: '颜色', default: '#1976d2' }, width: { type: 'number', label: '宽度', default: 200 }, height: { type: 'number', label: '高度', default: 200 }, radius: { type: 'number', label: '圆角', default: 0 } },
    defaultProps: { type: 'rect', color: '#1976d2', width: 200, height: 200 }, events: [],
  });
  registerMeta({
    type: 'LubanQRCode', category: 'content', label: '二维码', component: comp('LubanQRCode'),
    propSchema: { value: { type: 'string', label: '内容', required: true }, size: { type: 'number', label: '尺寸', default: 160 } },
    defaultProps: { value: 'https://example.com', size: 160 }, events: [],
  });
}

let built = false;
function ensureMeta(): void {
  if (!built) {
    buildDefaultMeta();
    built = true;
  }
}

export function getComponentMeta(type: string): ComponentMeta | undefined {
  ensureMeta();
  return metaByType[type];
}

export function getAllComponentMeta(): ComponentMeta[] {
  ensureMeta();
  return Object.values(metaByType);
}

export function registerComponentMeta(meta: ComponentMeta): void {
  built = true;
  registerMeta(meta);
}
