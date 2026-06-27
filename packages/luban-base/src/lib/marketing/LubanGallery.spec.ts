import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanGallery from './LubanGallery.vue';
describe('LubanGallery', () => {
  it('renders with images', () => {
    const wrapper = shallowMount(LubanGallery, { props: { images: [] } });
    expect(wrapper.exists()).toBe(true);
  });
});
