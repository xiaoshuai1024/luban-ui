export { default as LubanButton } from './lib/button/LubanButton.vue';
export type {
  ButtonVariant,
  ButtonColor,
  LubanButtonProps,
} from './lib/button/button-types';

export { default as LubanContainer } from './lib/layout/LubanContainer.vue';
export { default as LubanRow } from './lib/layout/LubanRow.vue';
export { default as LubanCol } from './lib/layout/LubanCol.vue';
export { default as LubanSidePanel } from './lib/layout/LubanSidePanel.vue';

export { default as LubanBanner } from './lib/content/LubanBanner.vue';
export { default as LubanText } from './lib/content/LubanText.vue';
export { default as LubanHero } from './lib/content/LubanHero.vue';
export { default as LubanCTA } from './lib/content/LubanCTA.vue';
export { default as LubanTestimonial } from './lib/content/LubanTestimonial.vue';
export { default as LubanLeadCapture } from './lib/content/LubanLeadCapture.vue';
export { default as LubanContentList } from './lib/content/LubanContentList.vue';

// === D15-E1 营销建站组件（marketing/ 子目录）===
export { default as LubanNavbar } from './lib/marketing/LubanNavbar.vue';
export { default as LubanFooter } from './lib/marketing/LubanFooter.vue';
export { default as LubanFeatureGrid } from './lib/marketing/LubanFeatureGrid.vue';
export { default as LubanStats } from './lib/marketing/LubanStats.vue';
export { default as LubanFAQ } from './lib/marketing/LubanFAQ.vue';
export { default as LubanPricing } from './lib/marketing/LubanPricing.vue';
export { default as LubanTestimonialCarousel } from './lib/marketing/LubanTestimonialCarousel.vue';
export { default as LubanGallery } from './lib/marketing/LubanGallery.vue';
export { default as LubanLogoCloud } from './lib/marketing/LubanLogoCloud.vue';

export { default as LubanForm } from './lib/form/LubanForm.vue';
export { default as LubanInput } from './lib/form/LubanInput.vue';
export { default as LubanTextArea } from './lib/form/LubanTextArea.vue';
export { default as LubanSelect } from './lib/form/LubanSelect.vue';
export { default as LubanCheckbox } from './lib/form/LubanCheckbox.vue';
export { default as LubanRadioGroup } from './lib/form/LubanRadioGroup.vue';
export { default as LubanSwitch } from './lib/form/LubanSwitch.vue';
export type {
  LubanInputType,
  LubanSelectOption,
  LubanRadioOption,
} from './lib/form/form-types';

// 表单补全（T-ui-11）
export { default as LubanDateRange } from './lib/form/LubanDateRange.vue';
export { default as LubanTimePicker } from './lib/form/LubanTimePicker.vue';
export { default as LubanTagInput } from './lib/form/LubanTagInput.vue';

// 营销物料族（T-ui-7）— LubanFooter 已在上方 D15-E1 导出，此处不重复
export { default as LubanCountdown } from './lib/marketing/LubanCountdown.vue';
export { default as LubanCoupon } from './lib/marketing/LubanCoupon.vue';
export { default as LubanModal } from './lib/marketing/LubanModal.vue';
export { default as LubanCarousel } from './lib/marketing/LubanCarousel.vue';
export { default as LubanNavBar } from './lib/marketing/LubanNavbar.vue';

// 网站搭建物料族（T-ui-8）
export { default as LubanImage } from './lib/website/LubanImage.vue';
export { default as LubanHeading } from './lib/website/LubanHeading.vue';
export { default as LubanLink } from './lib/website/LubanLink.vue';
export { default as LubanCard } from './lib/website/LubanCard.vue';
export { default as LubanDivider } from './lib/website/LubanDivider.vue';
export { default as LubanIcon } from './lib/website/LubanIcon.vue';
export { default as LubanList } from './lib/website/LubanList.vue';
export { default as LubanRichText } from './lib/website/LubanRichText.vue';
export { default as LubanVideo } from './lib/website/LubanVideo.vue';
export { default as LubanTabs } from './lib/website/LubanTabs.vue';
export { default as LubanCollapse } from './lib/website/LubanCollapse.vue';

// 留资物料族（T-ui-9）
export { default as LubanPhoneInput } from './lib/lead/LubanPhoneInput.vue';
export { default as LubanRegionSelect } from './lib/lead/LubanRegionSelect.vue';
export { default as LubanDatePicker } from './lib/lead/LubanDatePicker.vue';
export { default as LubanFileUpload } from './lib/lead/LubanFileUpload.vue';
export { default as LubanRating } from './lib/lead/LubanRating.vue';
export { default as LubanSlider } from './lib/lead/LubanSlider.vue';

// 海报物料族（T-ui-10）
export { default as LubanPoster } from './lib/poster/LubanPoster.vue';
export { default as LubanPosterText } from './lib/poster/LubanPosterText.vue';
export { default as LubanPosterImage } from './lib/poster/LubanPosterImage.vue';
export { default as LubanShape } from './lib/poster/LubanShape.vue';
export { default as LubanQRCode } from './lib/poster/LubanQRCode.vue';

// === V2-T1 主题系统（运行时换肤 API）===
// 顶层导入即触发 _variables.scss 的 :root 默认注入（由消费方 vite/webpack 处理 scss）。
// 这里只导出 JS API；CSS 变量层由 luban-base 的 styles 入口统一注入。
export {
  applyTheme,
  applyThemePreset,
  resetTheme,
  getCurrentTheme,
  getCurrentPreset,
  onThemeChange,
  LIGHT_PRESET,
  DARK_PRESET,
} from './theme';
export type {
  LubanThemeTokens,
  PartialThemeTokens,
  LubanThemeName,
} from './theme';
