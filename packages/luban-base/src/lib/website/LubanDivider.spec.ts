import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanDivider from './LubanDivider.vue';
describe('LubanDivider', () => {
  it('renders', () => {
    const w = shallowMount(LubanDivider);
    expect(w.exists()).toBe(true);
  });
});
