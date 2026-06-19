<script setup lang="ts">
/**
 * LubanTable — 数据表格物料组件（data-display/table）。
 *
 * 轻量自研实现（Material Design 风格），不依赖 element-plus。
 * - columns: { label, key, width? }[] 列定义
 * - rows:    数据行数组（datasource 解析后的记录集，由 RuntimeRenderer 注入）
 * - pageSize: 分页大小（<=0 表示不分页）
 * - striped / border: 视觉开关
 *
 * 物料态由 RuntimeRenderer 传入 datasource 解析结果作为 rows；
 * 设计期 rows 可空，组件展示 empty 插槽。
 */
interface TableColumn {
  label: string;
  key: string;
  width?: number | string;
}

withDefaults(
  defineProps<{
    columns?: TableColumn[];
    /** 数据行（datasource 解析结果；物料 propsSchema 不直接暴露 rows，由运行时注入） */
    rows?: Record<string, unknown>[];
    datasourceId?: string;
    pageSize?: number;
    striped?: boolean;
    border?: boolean;
  }>(),
  {
    columns: () => [],
    rows: () => [],
    datasourceId: '',
    pageSize: 10,
    striped: false,
    border: true,
  }
);

defineEmits<{
  /** 行点击（参数：该行记录对象） */
  rowClick: [row: Record<string, unknown>];
}>();

function normaliseWidth(width: number | string | undefined): string | undefined {
  if (width == null || width === '') return undefined;
  return typeof width === 'number' ? `${width}px` : String(width);
}
</script>

<template>
  <div class="lb-table" :class="{ 'lb-table--border': border }">
    <table class="lb-table__table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ width: normaliseWidth(col.width) }"
            class="lb-table__th"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, idx) in rows"
          :key="idx"
          class="lb-table__row"
          :class="{ 'lb-table__row--striped': striped && idx % 2 === 1 }"
          @click="$emit('rowClick', row)"
        >
          <td v-for="col in columns" :key="col.key" class="lb-table__td">
            {{ row?.[col.key] ?? '' }}
          </td>
        </tr>
        <tr v-if="rows.length === 0" class="lb-table__empty-row">
          <td :colspan="Math.max(columns.length, 1)" class="lb-table__empty">
            <slot name="empty">暂无数据</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.lb-table {
  width: 100%;
  overflow-x: auto;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
  background: #fff;

  &__table {
    width: 100%;
    border-collapse: collapse;
  }

  &__th {
    text-align: left;
    padding: 12px 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    background: #fafafa;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    white-space: nowrap;
  }

  &__td {
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.87);
  }

  &__row {
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
      background: rgba(25, 118, 210, 0.04);
    }
  }

  &__row--striped {
    background: #fafafa;
  }

  &__empty {
    text-align: center;
    padding: 24px 16px;
    color: rgba(0, 0, 0, 0.4);
  }

  &--border &__table {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>
