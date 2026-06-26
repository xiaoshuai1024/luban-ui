import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanTestimonial from './LubanTestimonial.vue';

describe('LubanTestimonial', () => {
  it('renders with content', () => {
    const wrapper = mount(LubanTestimonial, {
      props: { content: 'Great product!', author: 'John Doe', title: 'CEO' },
    });
    expect(wrapper.text()).toContain('Great product');
    expect(wrapper.text()).toContain('John Doe');
  });

  it('renders with default props', () => {
    const wrapper = mount(LubanTestimonial);
    expect(wrapper.exists()).toBe(true);
  });
});
