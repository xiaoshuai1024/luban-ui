import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanTestimonial from './LubanTestimonial.vue';

describe('LubanTestimonial', () => {
  it('renders without crash', () => {
    const wrapper = mount(LubanTestimonial);
    expect(wrapper.exists()).toBe(true);
  });
  it('renders with props', () => {
    const wrapper = mount(LubanTestimonial, { props: { content: 'Great!', author: 'John' } });
    expect(wrapper.html()).toBeTruthy();
  });
});
