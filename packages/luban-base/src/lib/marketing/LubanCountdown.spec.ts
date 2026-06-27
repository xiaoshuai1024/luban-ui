import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanCountdown from './LubanCountdown.vue';
describe('LubanCountdown', () => {
  it('renders', () => {
    const w = shallowMount(LubanCountdown);
    expect(w.exists()).toBe(true);
  });
});
