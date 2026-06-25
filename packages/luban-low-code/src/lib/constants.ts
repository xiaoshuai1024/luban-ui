/**
 * 组件类型常量（容器类型 / 表单控件类型）。
 *
 * @migration 13+1 物料 schema 重构（聚合收口，0.1.0）
 *
 * 重构后 CONTAINER_TYPES / FORM_CONTROL_TYPES 从 materialRegistry 动态派生：
 *  - CONTAINER_TYPES = materialRegistry 中 isContainer===true 的物料 name 集合；
 *  - FORM_CONTROL_TYPES = category==='form' 且非 LubanForm 的物料 name 集合
 *    （6 个表单控件：Input/TextArea/Select/Checkbox/RadioGroup/Switch）。
 *
 * 为保持与历史 `export const CONTAINER_TYPES = new Set(...)` 语义一致
 * （顶层 const、可同步访问），本文件在模块求值期立即触发 materials 聚合层
 * 注册：通过顶层 `import '../materials'` 的 side-effect 完成 registry 填充，
 * 随后同步派生两个 Set。
 *
 * @since 0.1.0
 */

// 顶层 side-effect import：确保 materialRegistry 在派生常量前已注册全部 14 物料。
// materials 聚合层只触发一次（ESM 模块缓存），后续 import 复用。
import '../materials';
import { materialRegistry } from './material/registry';

/**
 * 容器类型集合：所有 isContainer===true 的物料 name。
 *
 * 覆盖：LubanContainer / LubanRow / LubanCol / LubanForm / LubanSidePanel。
 */
export const CONTAINER_TYPES = new Set<string>(
  materialRegistry
    .getAll()
    .filter((def) => def.isContainer === true)
    .map((def) => def.name),
);

export function isContainerType(type: string): boolean {
  return CONTAINER_TYPES.has(type);
}

/**
 * 表单控件类型集合：category==='form' 且非容器型（排除 LubanForm）的物料。
 *
 * 覆盖 6 个控件：LubanInput / LubanTextArea / LubanSelect /
 * LubanCheckbox / LubanRadioGroup / LubanSwitch。
 *
 * 该集合与 LubanForm.acceptTypes 应保持一致（见 materials/form/form/material.ts）。
 */
export const FORM_CONTROL_TYPES = new Set<string>(
  materialRegistry
    .getAll()
    .filter((def) => def.category === 'form' && def.isContainer !== true)
    .map((def) => def.name),
);

/**
 * Component types that hold a form value (bound to formState). Mirrors the sets
 * hard-coded in DesignRenderer.vue / RuntimeRenderer.vue. New form-value materials
 * must be added here AND in those renderers.
 *
 * 注：FORM_CONTROL_TYPES 仅含 registry 已注册的基础控件（6 个）；本集合更宽，
 * 含本地新增的留资/海报表单值物料（PhoneInput/RegionSelect/DateRange 等），
 * 供渲染层 formState 绑定使用。待这些物料统一注册到 registry 后可合并派生。
 */
export const FORM_VALUE_TYPES = new Set<string>([
  'LubanInput',
  'LubanTextArea',
  'LubanSelect',
  'LubanCheckbox',
  'LubanRadioGroup',
  'LubanSwitch',
  // 新增表单值物料（T-ui-9/11）
  'LubanPhoneInput',
  'LubanRegionSelect',
  'LubanDatePicker',
  'LubanFileUpload',
  'LubanRating',
  'LubanSlider',
  'LubanDateRange',
  'LubanTimePicker',
  'LubanTagInput',
]);

export function isFormValueType(type: string): boolean {
  return FORM_VALUE_TYPES.has(type);
}

/**
 * Form-value types whose value defaults to boolean false (checkbox/switch).
 */
export const BOOLEAN_FORM_VALUE_TYPES = new Set<string>([
  'LubanCheckbox',
  'LubanSwitch',
]);

/**
 * Whether a child type can be dropped into a container type.
 * If acceptTypes is not defined for the container, any registered type is allowed.
 */
export function canAcceptChild(
  containerType: string,
  childType: string,
  getAcceptTypes: (type: string) => string[] | undefined,
): boolean {
  if (!CONTAINER_TYPES.has(containerType)) return false;
  const accept = getAcceptTypes(containerType);
  if (accept == null || accept.length === 0) return true;
  return accept.includes(childType);
}
