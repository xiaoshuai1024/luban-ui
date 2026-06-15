import type { Component } from 'vue';
import {
  // 基础物料
  LubanButton,
  LubanContainer,
  LubanRow,
  LubanCol,
  LubanBanner,
  LubanText,
  LubanForm,
  LubanInput,
  LubanTextArea,
  LubanSelect,
  LubanCheckbox,
  LubanRadioGroup,
  LubanSwitch,
  // 表单补全（T-ui-11）
  LubanDateRange,
  LubanTimePicker,
  LubanTagInput,
  // 营销物料族（T-ui-7）
  LubanCountdown,
  LubanCoupon,
  LubanModal,
  LubanCarousel,
  LubanNavBar,
  LubanFooter,
  // 网站搭建物料族（T-ui-8）
  LubanImage,
  LubanHeading,
  LubanLink,
  LubanCard,
  LubanDivider,
  LubanIcon,
  LubanList,
  LubanRichText,
  LubanVideo,
  LubanTabs,
  LubanCollapse,
  // 留资物料族（T-ui-9）
  LubanPhoneInput,
  LubanRegionSelect,
  LubanDatePicker,
  LubanFileUpload,
  LubanRating,
  LubanSlider,
  // 海报物料族（T-ui-10）
  LubanPoster,
  LubanPosterText,
  LubanPosterImage,
  LubanShape,
  LubanQRCode,
} from 'luban-base';

const registry: Record<string, Component> = {
  LubanButton,
  LubanContainer,
  LubanRow,
  LubanCol,
  LubanBanner,
  LubanText,
  LubanForm,
  LubanInput,
  LubanTextArea,
  LubanSelect,
  LubanCheckbox,
  LubanRadioGroup,
  LubanSwitch,
  // 表单补全
  LubanDateRange,
  LubanTimePicker,
  LubanTagInput,
  // 营销物料族
  LubanCountdown,
  LubanCoupon,
  LubanModal,
  LubanCarousel,
  LubanNavBar,
  LubanFooter,
  // 网站搭建物料族
  LubanImage,
  LubanHeading,
  LubanLink,
  LubanCard,
  LubanDivider,
  LubanIcon,
  LubanList,
  LubanRichText,
  LubanVideo,
  LubanTabs,
  LubanCollapse,
  // 留资物料族
  LubanPhoneInput,
  LubanRegionSelect,
  LubanDatePicker,
  LubanFileUpload,
  LubanRating,
  LubanSlider,
  // 海报物料族
  LubanPoster,
  LubanPosterText,
  LubanPosterImage,
  LubanShape,
  LubanQRCode,
};

export function getComponent(type: string): Component | undefined {
  return registry[type];
}

export function registerComponent(type: string, component: Component): void {
  registry[type] = component;
}
