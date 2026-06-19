<script setup lang="ts">
/**
 * LubanMenu — 导航菜单物料组件（navigation/menu）。
 *
 * 轻量自研实现（Material Design 风格），不依赖 element-plus。
 * 支持 horizontal/vertical 两种模式；支持子菜单（children 递归渲染）。
 * activeKey 受控（由父组件通过 props 同步）。
 */
interface MenuItem {
  label: string;
  key: string;
  children?: MenuItem[];
}

type MenuMode = 'horizontal' | 'vertical';

const props = withDefaults(
  defineProps<{
    items?: MenuItem[];
    mode?: MenuMode;
    activeKey?: string;
  }>(),
  {
    items: () => [],
    mode: 'horizontal',
    activeKey: '',
  }
);

const emit = defineEmits<{
  /** 选中菜单项（参数：item.key） */
  select: [key: string];
}>();

function isActive(key: string): boolean {
  return props.activeKey === key;
}

function onSelect(key: string): void {
  emit('select', key);
}
</script>

<template>
  <ul class="lb-menu" :class="`lb-menu--${mode}`" role="menubar">
    <template v-for="item in items" :key="item.key">
      <li
        class="lb-menu__item"
        :class="{ 'lb-menu__item--active': isActive(item.key) }"
        role="menuitem"
        @click="onSelect(item.key)"
      >
        <span class="lb-menu__label">{{ item.label }}</span>
        <ul
          v-if="item.children && item.children.length"
          class="lb-menu__submenu"
          role="menu"
        >
          <li
            v-for="child in item.children"
            :key="child.key"
            class="lb-menu__subitem"
            :class="{ 'lb-menu__subitem--active': isActive(child.key) }"
            role="menuitem"
            @click.stop="onSelect(child.key)"
          >
            {{ child.label }}
          </li>
        </ul>
      </li>
    </template>
  </ul>
</template>

<style scoped lang="scss">
.lb-menu {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
  background: #fff;

  &--horizontal {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);

    .lb-menu__item {
      position: relative;
    }
  }

  &--vertical {
    display: block;
    width: 200px;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }

  &__item {
    padding: 0 16px;
    height: 48px;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;

    &:hover {
      background: rgba(25, 118, 210, 0.04);
    }

    &--active {
      color: #1976d2;
      border-bottom: 2px solid #1976d2;
    }
  }

  &--vertical &__item--active {
    border-bottom: none;
    border-right: 2px solid #1976d2;
  }

  &__label {
    line-height: 1;
  }

  &__submenu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 160px;
    margin: 0;
    padding: 4px 0;
    list-style: none;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    z-index: 10;
  }

  &__subitem {
    padding: 8px 16px;
    cursor: pointer;

    &:hover {
      background: rgba(25, 118, 210, 0.04);
    }

    &--active {
      color: #1976d2;
      background: rgba(25, 118, 210, 0.08);
    }
  }
}
</style>
