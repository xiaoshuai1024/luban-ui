<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: Record<string, string>;
    label?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    modelValue: () => ({}),
    label: '省/市',
    required: false,
    disabled: false,
    error: false,
  },
);
const emit = defineEmits<{
  'update:modelValue': [v: Record<string, string>];
}>();
const PROVINCES = [
  '北京',
  '上海',
  '广东',
  '浙江',
  '江苏',
  '四川',
  '湖北',
  '福建',
  '山东',
  '河南',
];
const CITIES: Record<string, string[]> = {
  北京: ['北京市'],
  上海: ['上海市'],
  广东: ['广州', '深圳', '东莞', '佛山'],
  浙江: ['杭州', '宁波', '温州'],
  江苏: ['南京', '苏州', '无锡'],
  四川: ['成都', '绵阳'],
  湖北: ['武汉', '宜昌'],
  福建: ['福州', '厦门', '泉州'],
  山东: ['济南', '青岛'],
  河南: ['郑州', '洛阳'],
};
const province = ref<string>('');
const city = ref<string>('');
const emitUpdate = () =>
  emit('update:modelValue', { province: province.value, city: city.value });
// 从外部 modelValue 回填（设计器选中已有数据节点时 / formState 初始化时）
watch(
  () => props.modelValue,
  (mv) => {
    if (mv && typeof mv === 'object') {
      const r = mv as Record<string, string>;
      province.value = r.province || '';
      city.value = r.city || '';
    }
  },
  { immediate: true },
);
// province 变化时重置 city（避免省份不匹配），但不覆盖外部回填
watch(province, () => {
  if (city.value && !CITIES[province.value]?.includes(city.value)) {
    city.value = '';
    emitUpdate();
  }
});
</script>

<template>
  <div class="lb-form-field">
    <label
      v-if="label"
      class="lb-form-field__label"
      :class="{ 'lb-form-field__label--required': required }"
    >{{ label }}</label>
    <div class="lb-region__selects">
      <select
        v-model="province"
        class="lb-input"
        :disabled="disabled"
      >
        <option
          value=""
          disabled
        >
          省份
        </option>
        <option
          v-for="p in PROVINCES"
          :key="p"
          :value="p"
        >
          {{ p }}
        </option>
      </select>
      <select
        v-model="city"
        class="lb-input"
        :disabled="disabled"
        @change="emitUpdate"
      >
        <option
          value=""
          disabled
        >
          城市
        </option>
        <option
          v-for="c in CITIES[province] || []"
          :key="c"
          :value="c"
        >
          {{ c }}
        </option>
      </select>
    </div>
    <p
      v-if="error && errorMessage"
      class="lb-form-field__error"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/form.scss';
.lb-region__selects {
  display: flex;
  gap: 8px;
}
.lb-region__selects .lb-input {
  flex: 1;
}
</style>
