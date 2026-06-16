<script setup lang="ts">
/**
 * 多选对齐工具条（T-ui-d19）：
 * 当选中 ≥ 2 个节点时显示，提供对齐按钮组。
 * 对齐操作通过 emit('align', type) 上抛，PageEditor 调用 schemaUtils
 * 批量更新各节点 props.style（CSS-in-JS）。
 *
 * 布局类组件（非绝对定位）的对齐需通过 flex/justify 实现，
 * 本工具主要服务海报等绝对定位场景；非绝对定位场景对齐按钮自动禁用。
 */
type AlignType =
  | 'left' | 'center-h' | 'right'
  | 'top' | 'center-v' | 'bottom'
  | 'distribute-h' | 'distribute-v';

const props = withDefaults(
  defineProps<{
    /** 当前选中节点数 */
    selectedCount?: number;
    /** 是否支持绝对定位对齐（海报模式） */
    absoluteMode?: boolean;
  }>(),
  { selectedCount: 0, absoluteMode: false }
);

const emit = defineEmits<{
  align: [type: AlignType];
  /** 取消多选 */
  clear: [];
}>();

interface AlignBtn {
  type: AlignType;
  icon: string;
  label: string;
  /** 需要的最少选中数 */
  minCount: number;
  /** 是否仅绝对定位模式可用 */
  absoluteOnly?: boolean;
}

const ALIGN_BUTTONS: AlignBtn[] = [
  { type: 'left', icon: '⫛←', label: '左对齐', minCount: 2, absoluteOnly: true },
  { type: 'center-h', icon: '⫛⫴', label: '水平居中', minCount: 2, absoluteOnly: true },
  { type: 'right', icon: '⫛→', label: '右对齐', minCount: 2, absoluteOnly: true },
  { type: 'top', icon: '⊤⫛', label: '顶对齐', minCount: 2, absoluteOnly: true },
  { type: 'center-v', icon: '⫴⫛', label: '垂直居中', minCount: 2, absoluteOnly: true },
  { type: 'bottom', icon: '⊥⫛', label: '底对齐', minCount: 2, absoluteOnly: true },
  { type: 'distribute-h', icon: '⫷⫛⫸', label: '水平等距分布', minCount: 3, absoluteOnly: true },
  { type: 'distribute-v', icon: '⫷⫛⫸', label: '垂直等距分布', minCount: 3, absoluteOnly: true },
];

function isDisabled(btn: AlignBtn): boolean {
  if (props.selectedCount < btn.minCount) return true;
  if (btn.absoluteOnly && !props.absoluteMode) return true;
  return false;
}
</script>

<template>
  <div v-if="selectedCount >= 2" class="lb-multiselect">
    <span class="lb-multiselect__count">
      已选 <strong>{{ selectedCount }}</strong> 个
    </span>
    <div class="lb-multiselect__divider" />
    <div class="lb-multiselect__aligns">
      <button
        v-for="btn in ALIGN_BUTTONS"
        :key="btn.type"
        class="lb-multiselect__btn"
        :class="{ 'lb-multiselect__btn--disabled': isDisabled(btn) }"
        :title="btn.label + (isDisabled(btn) ? '' : '')"
        :disabled="isDisabled(btn)"
        @click="emit('align', btn.type)"
      >
        <span class="lb-multiselect__btn-icon">{{ btn.icon }}</span>
      </button>
    </div>
    <div class="lb-multiselect__divider" />
    <button class="lb-multiselect__clear" title="取消多选 (Esc)" @click="emit('clear')">
      ✕
    </button>
  </div>
</template>

<style scoped>
.lb-multiselect {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #303133;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
.lb-multiselect__count {
  font-size: 12px;
  color: #fff;
  padding: 0 4px;
}
.lb-multiselect__count strong {
  color: #66b1ff;
}
.lb-multiselect__divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.2);
}
.lb-multiselect__aligns {
  display: flex;
  gap: 2px;
}
.lb-multiselect__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 26px;
  padding: 0 6px;
  border: none;
  background: transparent;
  color: #d0d0d0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-family: monospace;
  transition: all 0.12s ease;
}
.lb-multiselect__btn:hover:not(.lb-multiselect__btn--disabled) {
  background: rgba(64, 158, 255, 0.3);
  color: #fff;
}
.lb-multiselect__btn--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.lb-multiselect__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #d0d0d0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.lb-multiselect__clear:hover {
  background: #f56c6c;
  color: #fff;
}
</style>
