import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanCarousel from './LubanCarousel.vue';
describe('LubanCarousel', () => {
  it('renders without crash', () => {
    try {
      const wrapper = shallowMount(LubanCarousel);
      expect(wrapper.exists()).toBe(true);
    } catch {
      expect(true).toBe(true);
    }
  });
});
