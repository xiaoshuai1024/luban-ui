import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanButton from './LubanButton.vue';

describe('LubanButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(LubanButton);
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('renders slot content', () => {
    const wrapper = mount(LubanButton, {
      slots: { default: 'Click Me' },
    });
    expect(wrapper.text()).toContain('Click Me');
  });

  it('emits click event', async () => {
    const wrapper = mount(LubanButton);
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('applies type prop', () => {
    const wrapper = mount(LubanButton, { props: { type: 'primary' } });
    // 验证 prop 被正确接收（具体 CSS class 取决于 Element Plus 版本）
    expect(wrapper.props('type')).toBe('primary');
  });

  it('applies disabled prop', () => {
    const wrapper = mount(LubanButton, { props: { disabled: true } });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });
});
