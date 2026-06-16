<script setup lang="ts">
import { getComponent } from './registry';
import type { NodeSchema } from './schema';
import { validate, type ValidationRule } from './validation';
import { isFormValueType } from './constants';
import { inject } from 'vue';

/** Optional form submit handler provided by the host app (e.g. website DynamicPage) */
interface FormSubmitPayload {
  formId: string;
  formState: Record<string, unknown>;
  event: Event;
}
const formSubmitHandler = inject<((payload: FormSubmitPayload) => void) | null>('lubanFormSubmit', null);

// FORM_VALUE_TYPES 从 constants 统一导入（T-ui-12 单一真相源）

const props = withDefaults(
  defineProps<{
    root: NodeSchema;
    formState: Record<string, unknown>;
    formErrors?: Record<string, string>;
  }>(),
  { formErrors: () => ({}) }
);

function getFormValue(name: string | undefined): unknown {
  if (name == null) return undefined;
  return props.formState[name];
}

function setFormValue(name: string | undefined, value: unknown): void {
  if (name == null) return;
  const state = props.formState as Record<string, unknown>;
  if (name in state) {
    state[name] = value;
    const rules = (props.root.props?.rules as ValidationRule[] | undefined);
    const message = validate(value, rules);
    if (message) {
      (props.formErrors as Record<string, string>)[name] = message;
    } else {
      delete (props.formErrors as Record<string, string>)[name];
    }
  }
}

function getFieldError(name: string | undefined): string | undefined {
  if (name == null) return undefined;
  return props.formErrors[name];
}

/** Re-run validation for a field (e.g. on blur) without changing value */
function validateField(name: string | undefined): void {
  if (name == null) return;
  const value = getFormValue(name);
  const rules = (props.root.props?.rules as ValidationRule[] | undefined);
  const message = validate(value, rules);
  const err = props.formErrors as Record<string, string>;
  if (message) err[name] = message;
  else delete err[name];
}

/** Props for form value component: base props + modelValue + error/errorMessage from validation */
function formValueProps(nodeProps: Record<string, unknown> | undefined, name: string | undefined): Record<string, unknown> {
  if (nodeProps == null) return {};
  const { content: _c, text: _t, rules: _r, ...rest } = nodeProps;
  const errorMessage = getFieldError(name);
  return {
    ...rest,
    error: !!errorMessage,
    errorMessage: errorMessage ?? undefined,
  };
}

/** Props for component, excluding content/text (used for slot instead) */
function componentProps(nodeProps: Record<string, unknown> | undefined): Record<string, unknown> {
  if (nodeProps == null) return {};
  const { content: _c, text: _t, rules: _r, style: _s, responsive: _rs, ...rest } = nodeProps;
  return rest;
}

/**
 * 合并节点样式（T-web-d1）：
 * - node.props.style: 基础 CSS-in-JS
 * - node.props.responsive: { pc?, tablet?, mobile? } 按当前设备叠加
 * 返回 Vue :style 对象语法。
 */
function mergedStyle(nodeProps: Record<string, unknown> | undefined): Record<string, string> | undefined {
  if (!nodeProps) return undefined;
  const style = (nodeProps.style as Record<string, string> | undefined) ?? {};
  const responsive = nodeProps.responsive as {
    pc?: Record<string, string>;
    tablet?: Record<string, string>;
    mobile?: Record<string, string>;
  } | undefined;
  if (!responsive) {
    return Object.keys(style).length > 0 ? style : undefined;
  }
  // 按断点叠加（PC 为基础，tablet/mobile 覆盖）。运行时无断点感知，全合并；
  // 真正的按设备渲染由 website 在 useRuntimeDevice 选择性裁剪 responsive。
  return { ...style, ...(responsive.pc ?? {}), ...(responsive.tablet ?? {}), ...(responsive.mobile ?? {}) };
}

function slotContent(): string {
  const p = props.root.props;
  if (p?.content != null) return String(p.content);
  if (p?.text != null) return String(p.text);
  return '';
}
</script>

<template>
  <template v-if="root">
    <!-- Form value components: bind v-model to formState + validation error -->
    <component
      v-if="getComponent(root.type) && isFormValueType(root.type)"
      :is="getComponent(root.type)"
      v-bind="formValueProps(root.props as Record<string, unknown>, root.props?.name as string)"
      :style="mergedStyle(root.props as Record<string, unknown>)"
      :model-value="
        root.props?.name != null
          ? getFormValue(root.props.name as string)
          : undefined
      "
      @update:model-value="
        root.props?.name != null
          ? setFormValue(root.props.name as string, $event)
          : () => {}
      "
      @blur="validateField(root.props?.name as string)"
    >
      <RuntimeRenderer
        v-for="child in (root.children ?? [])"
        :key="child.id"
        :root="child"
        :form-state="formState"
        :form-errors="formErrors"
      />
    </component>
    <!-- Non-form components: props only, optional slot from content/text -->
    <component
      v-else-if="getComponent(root.type)"
      :is="getComponent(root.type)"
      v-bind="componentProps(root.props as Record<string, unknown>)"
      :style="mergedStyle(root.props as Record<string, unknown>)"
      @submit="
        formSubmitHandler && root.type === 'LubanForm'
          ? formSubmitHandler({
              formId: (root.props?.formId as string) || '',
              formState: props.formState,
              event: $event,
            })
          : undefined
      "
    >
      <template v-if="(root.children ?? []).length">
        <RuntimeRenderer
          v-for="child in (root.children ?? [])"
          :key="child.id"
          :root="child"
          :form-state="formState"
          :form-errors="formErrors"
        />
      </template>
      <template v-else-if="slotContent()">{{ slotContent() }}</template>
    </component>
    <template v-else>
      <RuntimeRenderer
        v-for="child in (root.children ?? [])"
        :key="child.id"
        :root="child"
        :form-state="formState"
        :form-errors="formErrors"
      />
    </template>
  </template>
</template>
