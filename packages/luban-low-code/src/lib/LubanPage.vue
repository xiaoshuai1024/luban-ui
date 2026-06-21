<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import RuntimeRenderer from './RuntimeRenderer.vue';
import type { PageSchema, NodeSchema } from './schema';
import { treeResponsiveCss } from './responsiveStyle';

const props = defineProps<{
  schema: PageSchema | null | undefined;
  /**
   * 数据源拉取器（host 注入，如调 datasource query api）；缺省则不注入数据源数据。
   * 第二个可选参数是 node.datasource.params（动态查询参数），透传给后端 query。
   */
  datasourceFetcher?: (
    datasourceId: string,
    params?: Record<string, unknown>,
  ) => Promise<unknown>;
}>();

const formState = computed(() => props.schema?.formState ?? {});
const formErrors = ref<Record<string, string>>({});
const datasourceCtx = ref<Record<string, unknown>>({});

/**
 * V2-T4：整树响应式 @media CSS（website SSR 运行态按视口自动应用断点样式）。
 * 仅含 tablet/mobile 覆盖；desktop 内联样式由 RuntimeRenderer nodeStyleProps 直接应用。
 * 节点用 data-lb-node="<id>" 选择器隔离，避免全局污染。无响应式覆盖时为空串。
 */
const responsiveCss = computed(() =>
  props.schema?.root ? treeResponsiveCss(props.schema.root) : ''
);

/** 递归收集 schema 中所有 node.datasource 绑定（含 params） */
function collectDatasources(
  node: NodeSchema | null | undefined,
  out: { id: string; varName: string; params?: Record<string, unknown> }[],
): void {
  if (!node) return;
  if (node.datasource?.id) {
    out.push({
      id: node.datasource.id,
      varName: node.datasource.varName,
      params: node.datasource.params,
    });
  }
  for (const child of node.children ?? []) collectDatasources(child, out);
}

async function loadDatasources(): Promise<void> {
  if (!props.schema?.root || !props.datasourceFetcher) {
    datasourceCtx.value = {};
    return;
  }
  const binds: { id: string; varName: string; params?: Record<string, unknown> }[] = [];
  collectDatasources(props.schema.root, binds);
  if (binds.length === 0) {
    datasourceCtx.value = {};
    return;
  }
  const entries = await Promise.all(
    binds.map(async (b) => {
      try {
        const data = await props.datasourceFetcher!(b.id, b.params);
        return [b.varName, data] as const;
      } catch (e) {
        // Surface the failure so it's not silently swallowed in production. Never
        // log config.headers (credentials) — only id + the error message.
        console.warn(
          'datasource fetch failed:',
          b.id,
          (e as Error)?.message ?? e,
        );
        return [b.varName, null] as const;
      }
    }),
  );
  datasourceCtx.value = Object.fromEntries(entries);
}

watch(
  () => props.schema?.root?.id,
  () => {
    formErrors.value = {};
    loadDatasources();
  },
);
</script>

<template>
  <div class="luban-page">
    <!-- V2-T4 响应式 @media CSS：整树收集，按视口自动应用断点样式 -->
    <component :is="'style'" v-if="responsiveCss" v-html="responsiveCss" />
    <RuntimeRenderer
      v-if="schema?.root"
      :root="schema.root"
      :form-state="formState"
      :form-errors="formErrors"
      :ctx="datasourceCtx"
    />
  </div>
</template>

<style scoped>
.luban-page {
  min-height: 0;
}
</style>
