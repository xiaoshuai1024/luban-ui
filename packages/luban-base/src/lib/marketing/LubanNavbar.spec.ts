import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanNavbar from './LubanNavbar.vue';
describe('LubanNavbar', () => {
  it('renders', () => {
    const wrapper = shallowMount(LubanNavbar);
    expect(wrapper.exists()).toBe(true);
  });
});
