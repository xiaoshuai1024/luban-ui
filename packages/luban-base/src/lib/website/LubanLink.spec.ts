import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanLink from './LubanLink.vue';
describe('LubanLink', () => {
  it('renders', () => {
    const w = shallowMount(LubanLink);
    expect(w.exists()).toBe(true);
  });
});
