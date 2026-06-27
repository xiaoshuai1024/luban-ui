import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanCoupon from './LubanCoupon.vue';
describe('LubanCoupon', () => {
  it('renders', () => {
    const w = shallowMount(LubanCoupon);
    expect(w.exists()).toBe(true);
  });
});
