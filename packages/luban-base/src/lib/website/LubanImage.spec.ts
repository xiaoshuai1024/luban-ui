import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanImage from './LubanImage.vue';
describe('LubanImage', () => {
  it('renders with src', () => {
    const w = shallowMount(LubanImage, { props: { src: 'https://example.com/img.png' } });
    expect(w.exists()).toBe(true);
  });
});
