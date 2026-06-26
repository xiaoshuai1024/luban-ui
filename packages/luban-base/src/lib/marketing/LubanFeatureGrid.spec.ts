import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanFeatureGrid from './LubanFeatureGrid.vue';

describe('LubanFeatureGrid', () => {
  it('renders with empty features', () => {
    const wrapper = mount(LubanFeatureGrid, { props: { features: [] } });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders feature items', () => {
    const wrapper = mount(LubanFeatureGrid, {
      props: { features: [{ title: 'Fast', description: 'Very fast' }, { title: 'Secure', description: 'Very secure' }] },
    });
    expect(wrapper.text()).toContain('Fast');
    expect(wrapper.text()).toContain('Secure');
  });
});
