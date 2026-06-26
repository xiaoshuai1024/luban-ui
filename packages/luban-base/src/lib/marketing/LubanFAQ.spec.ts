import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanFAQ from './LubanFAQ.vue';

describe('LubanFAQ', () => {
  it('renders with empty items', () => {
    const wrapper = mount(LubanFAQ, { props: { items: [] } });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders FAQ items', () => {
    const wrapper = mount(LubanFAQ, {
      props: { items: [{ question: 'What is Luban?', answer: 'A low-code platform' }] },
    });
    expect(wrapper.text()).toContain('What is Luban?');
    expect(wrapper.text()).toContain('low-code');
  });
});
