import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanStats from './LubanStats.vue';

describe('LubanStats', () => {
  it('renders with empty stats', () => {
    const wrapper = mount(LubanStats, { props: { stats: [] } });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders stat items', () => {
    const wrapper = mount(LubanStats, {
      props: { stats: [{ value: '100+', label: 'Users' }, { value: '99%', label: 'Uptime' }] },
    });
    expect(wrapper.text()).toContain('100+');
    expect(wrapper.text()).toContain('Uptime');
  });
});
