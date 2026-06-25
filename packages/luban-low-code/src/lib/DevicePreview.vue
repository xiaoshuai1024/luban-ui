<script setup lang="ts">
import { computed } from 'vue';

/**
 * 多设备预览容器（T-ui-d9）：PC / Tablet / H5 设备外框 + 宽度 transition。
 * 将画布内容包裹到对应设备宽度的外框中，模拟访客视角。
 * 纯展示组件，device 通过 prop 传入（与 DesignerToolbar 联动）。
 */

export type DeviceType = 'pc' | 'tablet' | 'mobile';

interface DeviceConfig {
  label: string;
  width: number; // px，0 = 自适应（PC 满宽）
  icon: string;
  frameClass: string;
}

const DEVICE_CONFIG: Record<DeviceType, DeviceConfig> = {
  pc: { label: 'PC', width: 0, icon: '🖥️', frameClass: 'lb-device--pc' },
  tablet: {
    label: 'iPad',
    width: 768,
    icon: '📋',
    frameClass: 'lb-device--tablet',
  },
  mobile: {
    label: 'H5',
    width: 375,
    icon: '📱',
    frameClass: 'lb-device--mobile',
  },
};

const props = withDefaults(
  defineProps<{
    device?: DeviceType;
    /** 是否显示设备顶部状态条（时间/电量装饰） */
    showStatusBar?: boolean;
  }>(),
  { device: 'pc', showStatusBar: true },
);

const config = computed(() => DEVICE_CONFIG[props.device]);

const frameStyle = computed(() => {
  const w = config.value.width;
  if (w === 0) return {}; // PC 自适应
  return { width: `${w}px`, maxWidth: '100%' };
});
</script>

<template>
  <div class="lb-device" :class="config.frameClass">
    <!-- 移动端设备外框（带圆角边框，模拟手机壳） -->
    <div v-if="device !== 'pc'" class="lb-device__shell" :style="frameStyle">
      <!-- 听筒/摄像头装饰（仅 mobile） -->
      <div v-if="device === 'mobile' && showStatusBar" class="lb-device__notch">
        <span class="lb-device__notch-speaker" />
      </div>
      <!-- 状态栏 -->
      <div v-if="showStatusBar" class="lb-device__status-bar">
        <span class="lb-device__status-time">{{ config.label }}</span>
        <span class="lb-device__status-icons">
          <span class="lb-device__status-signal">📶</span>
          <span class="lb-device__status-battery">🔋</span>
        </span>
      </div>
      <!-- 内容区 -->
      <div class="lb-device__screen">
        <slot />
      </div>
    </div>

    <!-- PC：直接渲染（满宽），仅居中容器 -->
    <div v-else class="lb-device__pc-wrapper">
      <slot />
    </div>

    <!-- 设备标签（右下角浮动） -->
    <div class="lb-device__label">
      <span class="lb-device__label-icon">{{ config.icon }}</span>
      <span class="lb-device__label-text">{{ config.label }}</span>
      <span v-if="config.width > 0" class="lb-device__label-width"
        >{{ config.width }}px</span
      >
    </div>
  </div>
</template>

<style scoped>
.lb-device {
  display: flex;
  justify-content: center;
  padding: 16px;
  position: relative;
}

/* PC 自适应 */
.lb-device__pc-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 平板 / 手机 外框 */
.lb-device__shell {
  background: #fff;
  border-radius: 12px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    max-width 0.3s ease;
}

.lb-device--tablet .lb-device__shell {
  border: 1px solid #dcdfe6;
}

.lb-device--mobile .lb-device__shell {
  border-radius: 32px;
  border: 8px solid #1f1f1f;
  position: relative;
}

/* mobile 听筒 */
.lb-device__notch {
  display: flex;
  justify-content: center;
  padding: 8px 0 4px;
  background: #1f1f1f;
}
.lb-device__notch-speaker {
  width: 48px;
  height: 5px;
  border-radius: 3px;
  background: #333;
}

/* 状态栏 */
.lb-device__status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  height: 24px;
  font-size: 11px;
  color: #606266;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  user-select: none;
}
.lb-device__status-icons {
  display: flex;
  gap: 4px;
  font-size: 10px;
}

/* 内容区 */
.lb-device__screen {
  min-height: 200px;
  overflow: auto;
}

/* 设备标签（浮动在右下） */
.lb-device__label {
  position: fixed;
  bottom: 60px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(48, 49, 51, 0.85);
  color: #fff;
  border-radius: 12px;
  font-size: 12px;
  z-index: 20;
  backdrop-filter: blur(4px);
  pointer-events: none;
  user-select: none;
}
.lb-device__label-icon {
  font-size: 13px;
}
.lb-device__label-width {
  color: #c0c4cc;
  font-size: 11px;
}
</style>
