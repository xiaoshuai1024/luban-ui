/**
 * Component types that accept child nodes (drop zones in designer).
 */
export const CONTAINER_TYPES = new Set<string>([
  'LubanContainer',
  'LubanRow',
  'LubanCol',
  'LubanForm',
  'LubanPoster',
]);

export function isContainerType(type: string): boolean {
  return CONTAINER_TYPES.has(type);
}

/**
 * Component types that hold a form value (bound to formState). Mirrors the sets
 * hard-coded in DesignRenderer.vue / RuntimeRenderer.vue. New form-value materials
 * must be added here AND in those renderers.
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
  getAcceptTypes: (type: string) => string[] | undefined
): boolean {
  if (!CONTAINER_TYPES.has(containerType)) return false;
  const accept = getAcceptTypes(containerType);
  if (accept == null || accept.length === 0) return true;
  return accept.includes(childType);
}
