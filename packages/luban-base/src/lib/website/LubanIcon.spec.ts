import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanIcon from './LubanIcon.vue';
describe('LubanIcon', () => {
  it('renders', () => {
    const w = shallowMount(LubanIcon);
    expect(w.exists()).toBe(true);
  });
});
