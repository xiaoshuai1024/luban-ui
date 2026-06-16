export type { PageSchema, NodeSchema } from './lib/schema';
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
export {
  getPaletteGroups,
  getPaletteItems,
  isPaletteType,
} from './lib/palette';
export type { PaletteItem, PaletteCategory, PaletteGroup } from './lib/palette';
