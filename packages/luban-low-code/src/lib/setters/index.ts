import type { Component } from 'vue';
import type { PropSchemaItem } from '../componentMeta';
import ColorSetter from './ColorSetter.vue';
import SpacingSetter from './SpacingSetter.vue';
import ImageSetter from './ImageSetter.vue';
import RichTextSetter from './RichTextSetter.vue';
import CarouselSetter from './CarouselSetter.vue';
import TabsSetter from './TabsSetter.vue';
import LinkListSetter from './LinkListSetter.vue';

/**
 * 自定义设置器注册表（T-ui-d17 / T-ui-d18）。
 * PropertyPanel 按 PropSchemaItem.setter（或 type）查表，未命中则回退到内置 input。
 */
export interface SetterComponent extends Component {
  /** 标记 setter 组件（便于类型推导） */
  __isSetter?: true;
}

const setterRegistry = new Map<string, SetterComponent>();

/** 注册一个设置器（name 优先匹配 schema.setter，其次 schema.type） */
export function registerSetter(name: string, comp: SetterComponent): void {
  setterRegistry.set(name, comp);
}

/** 查找设置器组件；fallback 到内置基础类型由调用方处理 */
export function getSetter(name: string | undefined): SetterComponent | undefined {
  if (!name) return undefined;
  return setterRegistry.get(name);
}

/** 列出已注册的设置器名（调试/文档用） */
export function listSetterNames(): string[] {
  return Array.from(setterRegistry.keys());
}

// ---- 内置基础设置器（T-ui-d17）----
setterRegistry.set('color', ColorSetter as SetterComponent);
setterRegistry.set('spacing', SpacingSetter as SetterComponent);
setterRegistry.set('image', ImageSetter as SetterComponent);
setterRegistry.set('richtext', RichTextSetter as SetterComponent);

// ---- 物料级定制设置器（T-ui-d18）----
setterRegistry.set('carousel', CarouselSetter as SetterComponent);
setterRegistry.set('tabs', TabsSetter as SetterComponent);
setterRegistry.set('linklist', LinkListSetter as SetterComponent);

export type { PropSchemaItem };
export {
  ColorSetter,
  SpacingSetter,
  ImageSetter,
  RichTextSetter,
  CarouselSetter,
  TabsSetter,
  LinkListSetter,
};
