/**
 * 设计器组件面板配置：按「信息」「表单」「营销」「网站」「海报」分类。
 * 与 registry 中的组件保持一致，应用使用设计器时可直接使用本配置渲染面板。
 */

export type PaletteItem = { type: string; label: string };

/** 分类：信息 / 表单 / 营销 / 网站 / 海报（§4 物料分类枚举） */
export type PaletteCategory = '信息' | '表单' | '营销' | '网站' | '海报';

/** 按分类的组件项（覆盖所有基础 + 新增物料） */
const PALETTE_BY_CATEGORY: Record<PaletteCategory, PaletteItem[]> = {
  信息: [
    { type: 'LubanText', label: '文本' },
    { type: 'LubanBanner', label: '横幅' },
    { type: 'LubanButton', label: '按钮' },
    { type: 'LubanContainer', label: '容器' },
    { type: 'LubanRow', label: '行' },
    { type: 'LubanCol', label: '列' },
  ],
  表单: [
    { type: 'LubanForm', label: '表单' },
    { type: 'LubanInput', label: '输入框' },
    { type: 'LubanTextArea', label: '多行文本' },
    { type: 'LubanSelect', label: '选择' },
    { type: 'LubanCheckbox', label: '复选框' },
    { type: 'LubanRadioGroup', label: '单选' },
    { type: 'LubanSwitch', label: '开关' },
    // 表单补全（T-ui-11）
    { type: 'LubanDateRange', label: '日期范围' },
    { type: 'LubanTimePicker', label: '时间选择' },
    { type: 'LubanTagInput', label: '标签输入' },
    // 留资物料族（T-ui-9）
    { type: 'LubanPhoneInput', label: '手机号' },
    { type: 'LubanRegionSelect', label: '省市联动' },
    { type: 'LubanDatePicker', label: '日期选择' },
    { type: 'LubanFileUpload', label: '文件上传' },
    { type: 'LubanRating', label: '评分' },
    { type: 'LubanSlider', label: '滑块' },
  ],
  营销: [
    { type: 'LubanCountdown', label: '倒计时' },
    { type: 'LubanCoupon', label: '优惠券卡' },
    { type: 'LubanModal', label: '弹窗' },
    { type: 'LubanCarousel', label: '轮播图' },
    { type: 'LubanNavBar', label: '导航栏' },
    { type: 'LubanFooter', label: '页脚' },
  ],
  网站: [
    { type: 'LubanImage', label: '图片' },
    { type: 'LubanHeading', label: '标题' },
    { type: 'LubanLink', label: '链接' },
    { type: 'LubanCard', label: '卡片' },
    { type: 'LubanDivider', label: '分隔线' },
    { type: 'LubanIcon', label: '图标' },
    { type: 'LubanList', label: '列表' },
    { type: 'LubanRichText', label: '富文本' },
    { type: 'LubanVideo', label: '视频' },
    { type: 'LubanTabs', label: '标签页' },
    { type: 'LubanCollapse', label: '折叠面板' },
  ],
  海报: [
    { type: 'LubanPoster', label: '海报容器' },
    { type: 'LubanPosterText', label: '海报文本' },
    { type: 'LubanPosterImage', label: '海报图片' },
    { type: 'LubanShape', label: '形状' },
    { type: 'LubanQRCode', label: '二维码' },
  ],
};

/** 设计器组件面板分组 */
export type PaletteGroup = { category: PaletteCategory; items: PaletteItem[] };

const CATEGORY_ORDER: PaletteCategory[] = ['信息', '表单', '营销', '网站', '海报'];

/**
 * 获取按分类分组的组件列表，设计器面板应使用此列表渲染。
 * 始终包含当前所有已注册物料。
 */
export function getPaletteGroups(): PaletteGroup[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: [...PALETTE_BY_CATEGORY[category]],
  }));
}

/** 所有面板组件类型集合（用于校验 drop 类型是否合法） */
const PALETTE_TYPES = new Set<string>(
  CATEGORY_ORDER.flatMap((cat) => PALETTE_BY_CATEGORY[cat]).map((item) => item.type)
);

/**
 * 扁平的面板组件列表（按分类顺序），兼容需要平铺列表的用法。
 */
export function getPaletteItems(): PaletteItem[] {
  return CATEGORY_ORDER.flatMap((cat) => PALETTE_BY_CATEGORY[cat]);
}

/**
 * 判断类型是否为面板中已注册的组件类型（可用于 add-node 校验）。
 */
export function isPaletteType(type: string): boolean {
  return PALETTE_TYPES.has(type);
}
