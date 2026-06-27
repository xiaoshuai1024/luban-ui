import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanHeading from './LubanHeading.vue';
describe('LubanHeading', () => {
  it('renders with text', () => {
    const w = shallowMount(LubanHeading, { props: { text: 'Title' } });
    expect(w.exists()).toBe(true);
  });
});
