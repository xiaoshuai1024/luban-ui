/**
 * materials barrel — 24 物料统一注册入口（聚合收口层）。
 *
 * 职责：
 *  1. import 全部 24 个 material 定义（side-effect + re-export）；
 *  2. 调用 `materialRegistry.register(...)` 将每个物料纳入 registry；
 *  3. 导出 `materials` 数组与各 material 常量，供下游（registry/palette/
 *     componentMeta）经 registry 派生旧 ComponentMeta。
 *
 * 注册容错：重复注册（如热重载/测试隔离多次 import 本模块）会先 unregister
 * 再 register，避免 MaterialRegistry.register 抛 "duplicate name"。
 *
 * 物料构成：14 基础物料（general/content/layout/form）+ W1-T6 第1波新增
 * 6 物料（data-display/table · navigation/menu,tabs · feedback/modal,
 * drawer,toast）。后 6 物料的 category 不在旧 palette「信息/表单」映射集，
 * 由 PropertyPanel/registry 直接消费，不影响旧 palette 分组计数。
 *
 * @since 0.1.0
 */

import { materialRegistry } from '../lib/material/registry';
import type { MaterialDefinition } from '../lib/material/defineMaterial';

// === general 组 ===
import { buttonMaterial } from './general/button/material';
// === content 组 ===
import { bannerMaterial } from './content/banner/material';
import { contentListMaterial } from './content/content-list/material';
// === layout 组（含首次纳入的 SidePanel）===
import { containerMaterial } from './layout/container/material';
import { rowMaterial } from './layout/row/material';
import { colMaterial } from './layout/col/material';
import { sidePanelMaterial } from './layout/side-panel/material';
// === form 组 ===
import { formMaterial } from './form/form/material';
import { inputMaterial } from './form/input/material';
import { textAreaMaterial } from './form/textarea/material';
import { selectMaterial } from './form/select/material';
import { checkboxMaterial } from './form/checkbox/material';
import { radioGroupMaterial } from './form/radio-group/material';
import { switchMaterial } from './form/switch/material';
// === general/text（与 button 同组，import 分组保持文件来源可读）===
import { textMaterial } from './general/text/material';
// === data-display / navigation / feedback（W1-T6 第1波新增 6 物料）===
import { tableMaterial } from './data-display/table/material';
import { menuMaterial } from './navigation/menu/material';
import { tabsMaterial } from './navigation/tabs/material';
import { modalMaterial } from './feedback/modal/material';
import { drawerMaterial } from './feedback/drawer/material';
import { toastMaterial } from './feedback/toast/material';
// === marketing 组 ===
import { heroMaterial } from './marketing/hero/material';
import { ctaMaterial } from './marketing/cta/material';
import { testimonialMaterial } from './marketing/testimonial/material';
import { leadCaptureMaterial } from './marketing/lead-capture/material';
// === marketing 组 D15-E1 新增 9 营销建站物料 ===
import { navbarMaterial } from './marketing/navbar/material';
import { footerMaterial } from './marketing/footer/material';
import { featureGridMaterial } from './marketing/feature-grid/material';
import { statsMaterial } from './marketing/stats/material';
import { faqMaterial } from './marketing/faq/material';
import { pricingMaterial } from './marketing/pricing/material';
import { testimonialCarouselMaterial } from './marketing/testimonial-carousel/material';
import { galleryMaterial } from './marketing/gallery/material';
import { logoCloudMaterial } from './marketing/logo-cloud/material';
// === T-ui-8 新增 27 物料（website/lead/form/poster/marketing）===
import { cardMaterial } from './website/card/material';
import { collapseMaterial } from './website/collapse/material';
import { dividerMaterial } from './website/divider/material';
import { headingMaterial } from './website/heading/material';
import { iconMaterial } from './website/icon/material';
import { imageMaterial } from './website/image/material';
import { linkMaterial } from './website/link/material';
import { listMaterial } from './website/list/material';
import { richTextMaterial } from './website/rich-text/material';
import { videoMaterial } from './website/video/material';
import { datePickerMaterial } from './lead/date-picker/material';
import { phoneInputMaterial } from './lead/phone-input/material';
import { ratingMaterial } from './lead/rating/material';
import { regionSelectMaterial } from './lead/region-select/material';
import { sliderMaterial } from './lead/slider/material';
import { tagInputMaterial } from './form/tag-input/material';
import { timePickerMaterial } from './form/time-picker/material';
import { dateRangeMaterial } from './form/date-range/material';
import { posterMaterial } from './poster/poster/material';
import { posterImageMaterial } from './poster/poster-image/material';
import { posterTextMaterial } from './poster/poster-text/material';
import { qrCodeMaterial } from './poster/qr-code/material';
import { shapeMaterial } from './poster/shape/material';
import { carouselMaterial } from './marketing/carousel/material';
import { countdownMaterial } from './marketing/countdown/material';
import { couponMaterial } from './marketing/coupon/material';
import { navBarMaterial } from './marketing/nav-bar/material';

/**
 * 全部 20 物料定义（注册顺序：general → content → layout → form
 * → data-display/navigation/feedback）。
 *
 * 顺序仅影响 palette 默认展示顺序的稳定性，不影响 registry 行为
 *（registry 内部用 Map，按 name 索引）。
 */
export const materials: MaterialDefinition[] = [
  buttonMaterial,
  textMaterial,
  bannerMaterial,
  contentListMaterial,
  containerMaterial,
  rowMaterial,
  colMaterial,
  sidePanelMaterial,
  formMaterial,
  inputMaterial,
  textAreaMaterial,
  selectMaterial,
  checkboxMaterial,
  radioGroupMaterial,
  switchMaterial,
  // === W1-T6 第1波新增 6 物料 ===
  tableMaterial,
  menuMaterial,
  tabsMaterial,
  modalMaterial,
  drawerMaterial,
  toastMaterial,
  // === marketing 新物料 ===
  heroMaterial,
  ctaMaterial,
  testimonialMaterial,
  leadCaptureMaterial,
  // === marketing D15-E1 新增 9 营销建站物料 ===
  navbarMaterial,
  footerMaterial,
  featureGridMaterial,
  statsMaterial,
  faqMaterial,
  pricingMaterial,
  testimonialCarouselMaterial,
  galleryMaterial,
  logoCloudMaterial,
  // === T-ui-8 新增 27 物料 ===
  cardMaterial,
  collapseMaterial,
  dividerMaterial,
  headingMaterial,
  iconMaterial,
  imageMaterial,
  linkMaterial,
  listMaterial,
  richTextMaterial,
  videoMaterial,
  datePickerMaterial,
  phoneInputMaterial,
  ratingMaterial,
  regionSelectMaterial,
  sliderMaterial,
  tagInputMaterial,
  timePickerMaterial,
  dateRangeMaterial,
  posterMaterial,
  posterImageMaterial,
  posterTextMaterial,
  qrCodeMaterial,
  shapeMaterial,
  carouselMaterial,
  countdownMaterial,
  couponMaterial,
  navBarMaterial,
];

/**
 * 把物料注册到 materialRegistry（容错重复注册）。
 *
 * @internal 仅在本模块初始化时调用一次；多次 import 本模块时该函数
 * 可能被多次执行（ESM 模块缓存下通常只执行一次，但测试隔离/热重载场景
 * 可能重复），故用 unregister-first 策略保证幂等。
 */
function registerAll(): void {
  for (const def of materials) {
    if (materialRegistry.has(def.name)) {
      materialRegistry.unregister(def.name);
    }
    materialRegistry.register(def);
  }
}

// 模块加载即注册（side-effect）：只要本模块被 import 一次，registry 即就绪。
registerAll();

// === re-export 各 material 常量（下游可按需引用具体物料）===
export { buttonMaterial } from './general/button/material';
export { textMaterial } from './general/text/material';
export { bannerMaterial } from './content/banner/material';
export { contentListMaterial } from './content/content-list/material';
export { containerMaterial } from './layout/container/material';
export { rowMaterial } from './layout/row/material';
export { colMaterial } from './layout/col/material';
export { sidePanelMaterial } from './layout/side-panel/material';
export { formMaterial } from './form/form/material';
export { inputMaterial } from './form/input/material';
export { textAreaMaterial } from './form/textarea/material';
export { selectMaterial } from './form/select/material';
export { checkboxMaterial } from './form/checkbox/material';
export { radioGroupMaterial } from './form/radio-group/material';
export { switchMaterial } from './form/switch/material';
// === W1-T6 第1波新增 6 物料 re-export ===
export { tableMaterial } from './data-display/table/material';
export { menuMaterial } from './navigation/menu/material';
export { tabsMaterial } from './navigation/tabs/material';
export { modalMaterial } from './feedback/modal/material';
export { drawerMaterial } from './feedback/drawer/material';
export { toastMaterial } from './feedback/toast/material';
// === marketing 组 re-export ===
export { heroMaterial } from './marketing/hero/material';
export { ctaMaterial } from './marketing/cta/material';
export { testimonialMaterial } from './marketing/testimonial/material';
export { leadCaptureMaterial } from './marketing/lead-capture/material';
// === marketing D15-E1 新增 9 物料 re-export ===
export { navbarMaterial } from './marketing/navbar/material';
export { footerMaterial } from './marketing/footer/material';
export { featureGridMaterial } from './marketing/feature-grid/material';
export { statsMaterial } from './marketing/stats/material';
export { faqMaterial } from './marketing/faq/material';
export { pricingMaterial } from './marketing/pricing/material';
export { testimonialCarouselMaterial } from './marketing/testimonial-carousel/material';
export { galleryMaterial } from './marketing/gallery/material';
export { logoCloudMaterial } from './marketing/logo-cloud/material';
// === T-ui-8 新增 27 物料 re-export ===
export { cardMaterial } from './website/card/material';
export { collapseMaterial } from './website/collapse/material';
export { dividerMaterial } from './website/divider/material';
export { headingMaterial } from './website/heading/material';
export { iconMaterial } from './website/icon/material';
export { imageMaterial } from './website/image/material';
export { linkMaterial } from './website/link/material';
export { listMaterial } from './website/list/material';
export { richTextMaterial } from './website/rich-text/material';
export { videoMaterial } from './website/video/material';
export { datePickerMaterial } from './lead/date-picker/material';
export { phoneInputMaterial } from './lead/phone-input/material';
export { ratingMaterial } from './lead/rating/material';
export { regionSelectMaterial } from './lead/region-select/material';
export { sliderMaterial } from './lead/slider/material';
export { tagInputMaterial } from './form/tag-input/material';
export { timePickerMaterial } from './form/time-picker/material';
export { dateRangeMaterial } from './form/date-range/material';
export { posterMaterial } from './poster/poster/material';
export { posterImageMaterial } from './poster/poster-image/material';
export { posterTextMaterial } from './poster/poster-text/material';
export { qrCodeMaterial } from './poster/qr-code/material';
export { shapeMaterial } from './poster/shape/material';
export { carouselMaterial } from './marketing/carousel/material';
export { countdownMaterial } from './marketing/countdown/material';
export { couponMaterial } from './marketing/coupon/material';
export { navBarMaterial } from './marketing/nav-bar/material';
