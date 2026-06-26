<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PageSchema } from './schema';

/**
 * 版本对比面板（T-ui-d14）：版本列表 + 分屏对比 + 差异高亮 + 回滚。
 * 纯展示组件：
 * - versions: 版本列表（按时间倒序）
 * - 选中两个版本 → 分屏显示 JSON + 高亮差异行
 * - 回滚操作 emit rollback，由 PageEditor 调用 API
 */

export interface PageVersion {
  id: number;
  /** 版本号显示 */
  label: string;
  /** ISO 时间戳 */
  createdAt: string;
  /** 操作人 */
  operator?: string;
  /** 备注 */
  note?: string;
  /** 该版本的 schema 快照 */
  schema: PageSchema;
}

const props = withDefaults(
  defineProps<{
    versions: PageVersion[];
    /** 当前版本 id（高亮标记） */
    currentVersionId?: number | null;
    loading?: boolean;
  }>(),
  { currentVersionId: null, loading: false },
);

const emit = defineEmits<{
  rollback: [versionId: number];
  refresh: [];
  /** 预览某版本 */
  preview: [version: PageVersion];
}>();

// 选中的对比版本（最多 2 个）
const selectedIds = ref<number[]>([]);

function toggleSelect(id: number): void {
  const idx = selectedIds.value.indexOf(id);
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1);
  } else {
    if (selectedIds.value.length >= 2) selectedIds.value.shift();
    selectedIds.value.push(id);
  }
}

// 两个待对比版本
const compareVersions = computed(() => {
  if (selectedIds.value.length < 2) return null;
  const [a, b] = selectedIds.value;
  const va = props.versions.find((v) => v.id === a);
  const vb = props.versions.find((v) => v.id === b);
  if (!va || !vb) return null;
  return { a: va, b: vb };
});

// 计算行级差异（LCS 算法，正确识别新增/删除行）
const diffResult = computed(() => {
  if (!compareVersions.value) return null;
  const linesA = stringify(compareVersions.value.a.schema).split('\n');
  const linesB = stringify(compareVersions.value.b.schema).split('\n');
  return lcsDiff(linesA, linesB);
});

/** LCS 行级 diff：返回对齐后的行序列，标注每行的 diff 类型 */
function lcsDiff(
  a: string[],
  b: string[],
): { a: string; b: string; diff: 'same' | 'changed' | 'added' | 'removed' }[] {
  const n = a.length;
  const m = b.length;
  // dp[i][j] = a[0..i) 与 b[0..j) 的 LCS 长度
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  );
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  // 回溯生成对齐序列（从尾部）
  const rows: {
    a: string;
    b: string;
    diff: 'same' | 'changed' | 'added' | 'removed';
  }[] = [];
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      rows.unshift({ a: a[i - 1], b: b[j - 1], diff: 'same' });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      // a 有 b 无：removed
      rows.unshift({ a: a[i - 1], b: '', diff: 'removed' });
      i--;
    } else {
      // b 有 a 无：added
      rows.unshift({ a: '', b: b[j - 1], diff: 'added' });
      j--;
    }
  }
  while (i > 0) {
    rows.unshift({ a: a[i - 1], b: '', diff: 'removed' });
    i--;
  }
  while (j > 0) {
    rows.unshift({ a: '', b: b[j - 1], diff: 'added' });
    j--;
  }
  return rows;
}

function stringify(val: unknown): string {
  try {
    return JSON.stringify(val, null, 2);
  } catch {
    return '{}';
  }
}

const changedCount = computed(
  () => diffResult.value?.filter((r) => r.diff !== 'same').length ?? 0,
);

function isSelected(id: number): boolean {
  return selectedIds.value.includes(id);
}

function clearSelection(): void {
  selectedIds.value = [];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
</script>

<template>
  <div class="lb-version-compare">
    <!-- 版本列表 -->
    <div class="lb-version-compare__list">
      <div class="lb-version-compare__list-header">
        <span class="lb-version-compare__title">版本历史</span>
        <button
          class="lb-version-compare__icon-btn"
          title="刷新"
          @click="emit('refresh')"
        >
          ⟳
        </button>
      </div>
      <div
        v-if="loading"
        class="lb-version-compare__empty"
      >
        加载中...
      </div>
      <div
        v-else-if="versions.length === 0"
        class="lb-version-compare__empty"
      >
        暂无历史版本
      </div>
      <ul
        v-else
        class="lb-version-compare__versions"
      >
        <li
          v-for="v in versions"
          :key="v.id"
          class="lb-version-compare__version"
          :class="{
            'lb-version-compare__version--selected': isSelected(v.id),
            'lb-version-compare__version--current': v.id === currentVersionId,
          }"
          @click="toggleSelect(v.id)"
          @dblclick="emit('preview', v)"
        >
          <div class="lb-version-compare__version-main">
            <span class="lb-version-compare__version-label">{{ v.label }}</span>
            <span
              v-if="v.id === currentVersionId"
              class="lb-version-compare__current-tag"
            >当前</span>
          </div>
          <div class="lb-version-compare__version-meta">
            <span>{{ formatTime(v.createdAt) }}</span>
            <span
              v-if="v.operator"
              class="lb-version-compare__operator"
            >{{
              v.operator
            }}</span>
          </div>
          <div
            v-if="v.note"
            class="lb-version-compare__version-note"
          >
            {{ v.note }}
          </div>
        </li>
      </ul>
      <p
        v-if="versions.length > 0"
        class="lb-version-compare__hint"
      >
        点击选择 2 个版本对比，双击预览
      </p>
    </div>

    <!-- 对比视图 -->
    <div
      v-if="diffResult"
      class="lb-version-compare__diff"
    >
      <div class="lb-version-compare__diff-header">
        <span class="lb-version-compare__diff-title">
          差异对比（{{ changedCount }} 处不同）
        </span>
        <button
          class="lb-version-compare__btn"
          @click="clearSelection"
        >
          清除
        </button>
        <button
          v-if="compareVersions"
          class="lb-version-compare__btn lb-version-compare__btn--primary"
          @click="emit('rollback', compareVersions.b.id)"
        >
          ⟲ 回滚到 {{ compareVersions.b.label }}
        </button>
      </div>
      <div class="lb-version-compare__diff-panels">
        <div class="lb-version-compare__panel">
          <div class="lb-version-compare__panel-head">
            {{ compareVersions?.a.label }}
          </div>
          <pre class="lb-version-compare__code"><code
            v-for="(row, i) in diffResult"
            :key="i"
            class="lb-version-compare__line"
            :class="`lb-version-compare__line--${row.diff}`"
          >{{ row.a || ' ' }}</code></pre>
        </div>
        <div class="lb-version-compare__panel">
          <div class="lb-version-compare__panel-head">
            {{ compareVersions?.b.label }}
          </div>
          <pre class="lb-version-compare__code"><code
            v-for="(row, i) in diffResult"
            :key="i"
            class="lb-version-compare__line"
            :class="`lb-version-compare__line--${row.diff}`"
          >{{ row.b || ' ' }}</code></pre>
        </div>
      </div>
    </div>
    <div
      v-else
      class="lb-version-compare__diff-placeholder"
    >
      <span class="lb-version-compare__diff-placeholder-icon">⇄</span>
      <span>选择 2 个版本进行对比</span>
    </div>
  </div>
</template>

<style scoped>
.lb-version-compare {
  display: flex;
  height: 100%;
  font-size: 13px;
}
.lb-version-compare__list {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.lb-version-compare__list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
}
.lb-version-compare__title {
  font-weight: 500;
  color: #303133;
}
.lb-version-compare__icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #909399;
  padding: 2px 4px;
  border-radius: 3px;
}
.lb-version-compare__icon-btn:hover {
  background: #f0f2f5;
}
.lb-version-compare__empty {
  padding: 24px 12px;
  text-align: center;
  color: #c0c4cc;
}
.lb-version-compare__versions {
  list-style: none;
  margin: 0;
  padding: 4px;
  overflow-y: auto;
  flex: 1;
}
.lb-version-compare__version {
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 2px;
  transition: background 0.12s ease;
}
.lb-version-compare__version:hover {
  background: #f5f7fa;
}
.lb-version-compare__version--selected {
  background: #ecf5ff;
  box-shadow: inset 0 0 0 1px #409eff;
}
.lb-version-compare__version-main {
  display: flex;
  align-items: center;
  gap: 6px;
}
.lb-version-compare__version-label {
  font-weight: 500;
  color: #303133;
}
.lb-version-compare__current-tag {
  font-size: 10px;
  background: #67c23a;
  color: #fff;
  padding: 1px 6px;
  border-radius: 8px;
}
.lb-version-compare__version-meta {
  display: flex;
  gap: 8px;
  margin-top: 2px;
  font-size: 11px;
  color: #909399;
}
.lb-version-compare__operator {
  color: #409eff;
}
.lb-version-compare__version-note {
  margin-top: 2px;
  font-size: 11px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lb-version-compare__hint {
  padding: 8px 12px;
  font-size: 11px;
  color: #c0c4cc;
  margin: 0;
}

/* 对比区 */
.lb-version-compare__diff {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.lb-version-compare__diff-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}
.lb-version-compare__diff-title {
  flex: 1;
  font-weight: 500;
  color: #303133;
}
.lb-version-compare__btn {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
}
.lb-version-compare__btn:hover {
  border-color: #409eff;
  color: #409eff;
}
.lb-version-compare__btn--primary {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
.lb-version-compare__btn--primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
.lb-version-compare__diff-panels {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.lb-version-compare__panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid #f0f0f0;
}
.lb-version-compare__panel:last-child {
  border-right: none;
}
.lb-version-compare__panel-head {
  padding: 6px 12px;
  font-size: 12px;
  color: #909399;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}
.lb-version-compare__code {
  margin: 0;
  padding: 8px 0;
  overflow: auto;
  font-family: 'SFMono-Regular', Consolas, Menlo, monospace;
  font-size: 12px;
  line-height: 1.6;
  background: #fff;
}
.lb-version-compare__line {
  display: block;
  padding: 0 12px;
  white-space: pre-wrap;
  word-break: break-all;
  color: #303133;
}
.lb-version-compare__line--added {
  background: #f0f9eb;
  color: #67c23a;
}
.lb-version-compare__line--removed {
  background: #fef0f0;
  color: #f56c6c;
  text-decoration: line-through;
}
.lb-version-compare__line--changed {
  background: #fdf6ec;
  color: #e6a23c;
}
.lb-version-compare__diff-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #c0c4cc;
}
.lb-version-compare__diff-placeholder-icon {
  font-size: 32px;
}
</style>
