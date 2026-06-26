import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanPricing from './LubanPricing.vue';

describe('LubanPricing', () => {
  it('renders with empty plans', () => {
    const wrapper = mount(LubanPricing, { props: { plans: [] } });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders pricing plans', () => {
    const wrapper = mount(LubanPricing, {
      props: { plans: [{ name: 'Basic', price: '$9', features: ['Feature 1'] }] },
    });
    expect(wrapper.text()).toContain('Basic');
    expect(wrapper.text()).toContain('$9');
  });
});
