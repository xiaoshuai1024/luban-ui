import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanLogoCloud from './LubanLogoCloud.vue';
describe('LubanLogoCloud', () => {
  it('renders', () => {
    const wrapper = shallowMount(LubanLogoCloud);
    expect(wrapper.exists()).toBe(true);
  });
});
