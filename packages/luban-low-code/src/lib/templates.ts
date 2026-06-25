import type { PageSchema } from './schema';

/**
 * 内置页面模板（T-ui-d23）：5 个标准 PageSchema JSON 模板。
 * 应用模板 = 深拷贝 → 替换当前 schema → useHistory.push。
 * 模板中的 formId 为占位值，应用时由业务层提示关联真实表单。
 */

export interface PageTemplate {
  id: string;
  name: string;
  /** 模板分类标签 */
  category: '营销' | '表单' | '海报' | '官网' | '落地页';
  /** 简介 */
  description: string;
  /** 缩略图（emoji 占位，可替换为真实截图 URL） */
  thumbnail: string;
  /** 模板 schema */
  schema: PageSchema;
}

/** 营销活动页：Banner + 倒计时 + 优惠券 + CTA */
const marketingTemplate: PageSchema = {
  formState: {},
  root: {
    id: 'tpl-root-marketing',
    type: 'LubanContainer',
    props: { maxWidth: 'mobile', padded: true },
    children: [
      {
        id: 'tpl-mkt-banner',
        type: 'LubanBanner',
        props: {
          title: '🔥 618 年中大促',
          subtitle: '全场低至 5 折，限时抢购',
          image: '',
          ctaText: '立即抢购',
        },
        children: [],
      },
      {
        id: 'tpl-mkt-countdown',
        type: 'LubanCountdown',
        props: { targetTime: '', label: '距活动结束' },
        children: [],
      },
      {
        id: 'tpl-mkt-coupon-1',
        type: 'LubanCoupon',
        props: { amount: 50, threshold: 300, label: '满 300 减 50' },
        children: [],
      },
      {
        id: 'tpl-mkt-coupon-2',
        type: 'LubanCoupon',
        props: { amount: 100, threshold: 500, label: '满 500 减 100' },
        children: [],
      },
      {
        id: 'tpl-mkt-cta',
        type: 'LubanButton',
        props: {
          content: '🛒 立即下单',
          variant: 'contained',
          color: 'primary',
        },
        children: [],
      },
    ],
  },
};

/** 留资表单页：标题 + 表单（姓名/手机/邮箱）+ 提交按钮 */
const formTemplate: PageSchema = {
  formState: { name: '', phone: '', email: '' },
  root: {
    id: 'tpl-root-form',
    type: 'LubanContainer',
    props: { maxWidth: 'narrow', padded: true },
    children: [
      {
        id: 'tpl-form-heading',
        type: 'LubanHeading',
        props: { text: '免费获取方案', level: 2, align: 'center' },
        children: [],
      },
      {
        id: 'tpl-form-body',
        type: 'LubanForm',
        props: {
          formId: 'tpl-form-placeholder',
          submitText: '提交',
          layout: 'vertical',
        },
        children: [
          {
            id: 'tpl-form-name',
            type: 'LubanInput',
            props: {
              name: 'name',
              label: '姓名',
              placeholder: '请输入姓名',
              required: true,
            },
            children: [],
          },
          {
            id: 'tpl-form-phone',
            type: 'LubanPhoneInput',
            props: {
              name: 'phone',
              label: '手机号',
              placeholder: '请输入手机号',
              required: true,
            },
            children: [],
          },
          {
            id: 'tpl-form-email',
            type: 'LubanInput',
            props: { name: 'email', label: '邮箱', placeholder: '请输入邮箱' },
            children: [],
          },
        ],
      },
    ],
  },
};

/** 海报页：海报容器 + 文本/图片/二维码 */
const posterTemplate: PageSchema = {
  formState: {},
  root: {
    id: 'tpl-root-poster',
    type: 'LubanPoster',
    props: {
      width: 750,
      height: 1334,
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
    },
    children: [
      {
        id: 'tpl-poster-title',
        type: 'LubanPosterText',
        props: {
          text: '邀请函',
          fontSize: 64,
          color: '#ffffff',
          fontWeight: 'bold',
          top: 120,
          left: 0,
          align: 'center',
        },
        children: [],
      },
      {
        id: 'tpl-poster-sub',
        type: 'LubanPosterText',
        props: {
          text: '诚邀您参加年度盛典',
          fontSize: 32,
          color: '#ffffff',
          top: 220,
          left: 0,
          align: 'center',
        },
        children: [],
      },
      {
        id: 'tpl-poster-image',
        type: 'LubanPosterImage',
        props: {
          src: '',
          width: 400,
          height: 400,
          top: 320,
          left: 175,
          borderRadius: 12,
        },
        children: [],
      },
      {
        id: 'tpl-poster-qrcode',
        type: 'LubanQRCode',
        props: {
          value: 'https://example.com',
          size: 160,
          top: 1100,
          left: 295,
        },
        children: [],
      },
    ],
  },
};

/** 企业官网首页：导航 + Banner + 介绍卡片组 + 页脚 */
const websiteTemplate: PageSchema = {
  formState: {},
  root: {
    id: 'tpl-root-website',
    type: 'LubanContainer',
    props: { maxWidth: 'full', padded: false },
    children: [
      {
        id: 'tpl-web-navbar',
        type: 'LubanNavBar',
        props: {
          title: '公司名称',
          links: [
            { label: '首页', href: '#', target: '_self' },
            { label: '产品', href: '#products', target: '_self' },
            { label: '关于我们', href: '#about', target: '_self' },
            { label: '联系', href: '#contact', target: '_self' },
          ],
        },
        children: [],
      },
      {
        id: 'tpl-web-banner',
        type: 'LubanBanner',
        props: {
          title: '专业解决方案提供商',
          subtitle: '助力企业数字化转型',
          ctaText: '了解详情',
        },
        children: [],
      },
      {
        id: 'tpl-web-cards',
        type: 'LubanRow',
        props: { gutter: 16 },
        children: [
          {
            id: 'tpl-web-card-1',
            type: 'LubanCard',
            props: {
              title: '产品 1',
              description: '高效稳定的核心产品',
              image: '',
            },
            children: [],
          },
          {
            id: 'tpl-web-card-2',
            type: 'LubanCard',
            props: {
              title: '产品 2',
              description: '灵活可扩展的解决方案',
              image: '',
            },
            children: [],
          },
          {
            id: 'tpl-web-card-3',
            type: 'LubanCard',
            props: {
              title: '产品 3',
              description: '安全可靠的企业服务',
              image: '',
            },
            children: [],
          },
        ],
      },
      {
        id: 'tpl-web-footer',
        type: 'LubanFooter',
        props: {
          copyright: '© 2026 公司名称',
          links: [
            { label: '隐私政策', href: '#', target: '_self' },
            { label: '服务条款', href: '#', target: '_self' },
          ],
        },
        children: [],
      },
    ],
  },
};

/** 活动落地页：Banner + 倒计时 + 富文本介绍 + 表单留资 + CTA */
const landingTemplate: PageSchema = {
  formState: { name: '', phone: '' },
  root: {
    id: 'tpl-root-landing',
    type: 'LubanContainer',
    props: { maxWidth: 'mobile', padded: true },
    children: [
      {
        id: 'tpl-land-banner',
        type: 'LubanBanner',
        props: {
          title: '🚀 新品发布',
          subtitle: '预约体验，享首发优惠',
          ctaText: '立即预约',
        },
        children: [],
      },
      {
        id: 'tpl-land-countdown',
        type: 'LubanCountdown',
        props: { targetTime: '', label: '距首发' },
        children: [],
      },
      {
        id: 'tpl-land-intro',
        type: 'LubanRichText',
        props: {
          content:
            '<h3>核心亮点</h3><ul><li>✅ 极致性能，毫秒级响应</li><li>✅ 智能化，AI 加持</li><li>✅ 安全可靠，企业级保障</li></ul>',
        },
        children: [],
      },
      {
        id: 'tpl-land-form',
        type: 'LubanForm',
        props: {
          formId: 'tpl-land-placeholder',
          submitText: '预约体验',
          layout: 'vertical',
        },
        children: [
          {
            id: 'tpl-land-name',
            type: 'LubanInput',
            props: {
              name: 'name',
              label: '姓名',
              placeholder: '请输入姓名',
              required: true,
            },
            children: [],
          },
          {
            id: 'tpl-land-phone',
            type: 'LubanPhoneInput',
            props: {
              name: 'phone',
              label: '手机号',
              placeholder: '请输入手机号',
              required: true,
            },
            children: [],
          },
        ],
      },
      {
        id: 'tpl-land-cta',
        type: 'LubanButton',
        props: {
          content: '🎉 立即预约首发',
          variant: 'contained',
          color: 'primary',
        },
        children: [],
      },
    ],
  },
};

/** 5 个内置模板（不可变，应用时深拷贝） */
export const PAGE_TEMPLATES: readonly PageTemplate[] = [
  {
    id: 'marketing',
    name: '营销活动页',
    category: '营销',
    description: 'Banner + 倒计时 + 优惠券 + CTA，适合促销活动',
    thumbnail: '🛍️',
    schema: marketingTemplate,
  },
  {
    id: 'lead-form',
    name: '留资表单页',
    category: '表单',
    description: '标题 + 姓名/手机/邮箱表单，适合线索收集',
    thumbnail: '📝',
    schema: formTemplate,
  },
  {
    id: 'poster',
    name: '海报页',
    category: '海报',
    description: '海报容器 + 文本/图片/二维码，适合活动海报',
    thumbnail: '🎨',
    schema: posterTemplate,
  },
  {
    id: 'website',
    name: '企业官网首页',
    category: '官网',
    description: '导航 + Banner + 产品卡片 + 页脚，适合企业展示',
    thumbnail: '🏢',
    schema: websiteTemplate,
  },
  {
    id: 'landing',
    name: '活动落地页',
    category: '落地页',
    description: 'Banner + 倒计时 + 富文本 + 留资表单，适合新品首发',
    thumbnail: '🚀',
    schema: landingTemplate,
  },
] as const;

/** 按 id 获取模板（返回深拷贝，避免污染常量） */
export function getTemplate(id: string): PageSchema | null {
  const tpl = PAGE_TEMPLATES.find((t) => t.id === id);
  if (!tpl) return null;
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(tpl.schema);
    } catch {
      /* fallback */
    }
  }
  return JSON.parse(JSON.stringify(tpl.schema));
}
