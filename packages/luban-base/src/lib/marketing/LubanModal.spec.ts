import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanModal from './LubanModal.vue';
describe('LubanModal', () => {
  it('renders', () => {
    const w = shallowMount(LubanModal);
    expect(w.exists()).toBe(true);
  });
});
