<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import RuntimeRenderer from './RuntimeRenderer.vue';
import type { PageSchema, NodeSchema } from './schema';

const props = defineProps<{
  schema: PageSchema | null | undefined;
  /** 数据源拉取器（host 注入，如调 datasource query api）；缺省则不注入数据源数据 */
  datasourceFetcher?: (datasourceId: string) => Promise<unknown>;
}>();

const formState = computed(() => props.schema?.formState ?? {});
const formErrors = ref<Record<string, string>>({});
const datasourceCtx = ref<Record<string, unknown>>({});

/** 递归收集 schema 中所有 node.datasource 绑定 */
function collectDatasources(node: NodeSchema | null | undefined, out: { id: string; varName: string }[]): void {
  if (!node) return;
  if (node.datasource?.id) out.push({ id: node.datasource.id, varName: node.datasource.varName });
  for (const child of node.children ?? []) collectDatasources(child, out);
}

async function loadDatasources(): Promise<void> {
  if (!props.schema?.root || !props.datasourceFetcher) {
    datasourceCtx.value = {};
    return;
  }
  const binds: { id: string; varName: string }[] = [];
  collectDatasources(props.schema.root, binds);
  if (binds.length === 0) {
    datasourceCtx.value = {};
    return;
  }
  const entries = await Promise.all(
    binds.map(async (b) => {
      try {
        const data = await props.datasourceFetcher!(b.id);
        return [b.varName, data] as const;
      } catch {
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
