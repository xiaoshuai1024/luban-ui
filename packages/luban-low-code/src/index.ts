export type { PageSchema, NodeSchema, NodeLoop, NodeDatasource, PageSeo, NodeResponsive, ResponsiveBreakpoint, NodeAnimation, AnimationType, AnimationTrigger, NodeCmsBinding } from './lib/schema';
export type { ValidationRule } from './lib/validation';
export { validate, validateAll, initFormState } from './lib/validation';
export { default as LubanDesigner } from './lib/LubanDesigner.vue';
export { default as LubanPage } from './lib/LubanPage.vue';
export { default as DesignRenderer } from './lib/DesignRenderer.vue';
export { default as RuntimeRenderer } from './lib/RuntimeRenderer.vue';
export { default as PropertyPanel } from './lib/PropertyPanel.vue';
export { default as OutlineTree } from './lib/OutlineTree.vue';
export { default as ComponentPanel } from './lib/ComponentPanel.vue';
export { default as DesignerToolbar } from './lib/DesignerToolbar.vue';
export { default as NodeToolbar } from './lib/NodeToolbar.vue';
export { default as DevicePreview } from './lib/DevicePreview.vue';
export type { DeviceType } from './lib/DevicePreview.vue';
export { default as ContextMenu } from './lib/ContextMenu.vue';
export { default as AlignGuides } from './lib/AlignGuides.vue';
export type { AlignRect } from './lib/AlignGuides.vue';
export { default as CodeEditor } from './lib/CodeEditor.vue';
export { default as VersionCompare } from './lib/VersionCompare.vue';
export type { PageVersion } from './lib/VersionCompare.vue';
export { default as HistoryPanel } from './lib/HistoryPanel.vue';
export { default as CanvasZoom } from './lib/CanvasZoom.vue';
export { default as MultiSelectToolbar } from './lib/MultiSelectToolbar.vue';

// setters（T-ui-d17 / T-ui-d18）
export {
  registerSetter,
  getSetter,
  listSetterNames,
  ColorSetter,
  SpacingSetter,
  ImageSetter,
  RichTextSetter,
  CarouselSetter,
  TabsSetter,
  LinkListSetter,
} from './lib/setters';
export type { SetterComponent } from './lib/setters';

// 页面模板（T-ui-d23）
export { PAGE_TEMPLATES, getTemplate } from './lib/templates';
export type { PageTemplate } from './lib/templates';
export { useHistory } from './lib/useHistory';
export { getComponent, registerComponent } from './lib/registry';
export {
  getComponentMeta,
  getAllComponentMeta,
  registerComponentMeta,
} from './lib/componentMeta';
export type { ComponentMeta, PropSchema, PropSchemaItem } from './lib/componentMeta';
export {
  CONTAINER_TYPES,
  FORM_CONTROL_TYPES,
  isContainerType,
  canAcceptChild,
  FORM_VALUE_TYPES,
  isFormValueType,
  BOOLEAN_FORM_VALUE_TYPES,
} from './lib/constants';
export {
  reorderRootChildren,
  findNode,
  findParent,
  removeNode,
  duplicateNode,
  moveNode,
  insertNode,
  updateNodeProps,
  bringToFront,
  sendToBack,
  cloneNode,
  genNodeId,
} from './lib/schemaUtils';

// === V2-T4 响应式断点（per-breakpoint style + @media CSS 输出）===
export {
  BREAKPOINTS,
  resolveResponsiveProps,
  hasResponsiveOverrides,
} from './lib/responsive';
export { nodeResponsiveCss, treeResponsiveCss } from './lib/responsiveStyle';

// === V2-T5 动画系统（@keyframes CSS + IntersectionObserver scroll 触发）===
export {
  buildAnimationCss,
  treeAnimationCss,
  isValidAnimation,
} from './lib/animation';
export {
  useAnimationObserver,
  collectInViewNodes,
} from './lib/animationObserver';

// === V2-T12 拖拽对齐辅助线（纯逻辑计算 + DOM rect 收集）===
export {
  computeAlignGuides,
  computeSpacingHints,
  collectNodeRects,
  dedupeGuides,
} from './lib/alignGuides';
export type { Rect, GuideLine, AlignResult, SpacingHint } from './lib/alignGuides';

// === V2-T7 CMS 绑定解析（纯逻辑）===
export {
  resolveCmsProps,
  sortAndLimitItems,
  collectBoundCollectionIds,
} from './lib/cmsBinding';
export type { CollectionItemData, ResolvedCollectionItem } from './lib/cmsBinding';
export {
  getPaletteGroups,
  getPaletteItems,
  isPaletteType,
} from './lib/palette';
export type { PaletteItem, PaletteCategory, PaletteGroup } from './lib/palette';

// === expression sandbox (低代码表达式引擎, 自研沙箱 0.1.0) ===
// evaluate/interpolate/evaluateBoolean：供 RuntimeRenderer 条件/循环/事件求值、
// PropertyPanel 表达式输入消费。沙箱禁 eval/Function/危险标识符（见 expression.ts）。
export { evaluate, interpolate, evaluateBoolean } from './lib/expression';

// === action runner (事件动作执行器, W1-T4) ===
// host 可 import createActionRunner 自定义动作路由，或直接复用 ActionContext 类型
// 注入 navigate/alert/setVar。RuntimeRenderer 通过 provide('lubanActionRunner') 消费。
export { createActionRunner, parseAction, evalArg } from './lib/action';
export type { ActionRunner, ActionContext } from './lib/action';

// === material contract layer (foundation, 0.1.0) ===
// defineMaterial + MaterialRegistry + JSON Schema 类型 + compat 适配层。
// 旧导出（getComponentMeta 等）保持不变；新物料统一通过 defineMaterial 声明。
export {
  defineMaterial,
  MaterialRegistry,
  materialRegistry,
  toLegacyComponentMeta,
  propsSchemaToLegacy,
  deriveDefaultProps,
} from './lib/material';
export type {
  MaterialDefinition,
  MaterialEvent,
  MaterialSlot,
  JSONSchemaObject,
  JSONSchemaProperty,
  JSONSchemaTypeName,
} from './lib/material';

// === materials aggregation (聚合收口, 0.1.0) ===
// 顶层 import 触发 side-effect：把 14 物料注册到 materialRegistry。
// 该 import 必须出现在包入口，否则单独 import lib/* 的下游会拿到空 registry。
// constants.ts / componentMeta.ts 内部也各自 import './materials' 以保证
// 同步派生时 registry 已就绪；ESM 模块缓存保证只执行一次。
import './materials';
import type { MaterialDefinition } from './lib/material';
export { materials } from './materials';
export {
  buttonMaterial,
  textMaterial,
  bannerMaterial,
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
  tableMaterial,
  menuMaterial,
  tabsMaterial,
  modalMaterial,
  drawerMaterial,
  toastMaterial,
} from './materials';

/**
 * 按物料 name 取 MaterialDefinition（便捷封装，等价于 materialRegistry.get）。
 * @since 0.1.0
 */
export function getMaterial(name: string): MaterialDefinition | undefined {
  return materialRegistry.get(name);
}

