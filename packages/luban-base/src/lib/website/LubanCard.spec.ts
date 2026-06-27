import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import LubanCard from './LubanCard.vue';
describe('LubanCard', () => {
  it('renders', () => {
    const w = shallowMount(LubanCard);
    expect(w.exists()).toBe(true);
  });
  it('renders with title', () => {
    const w = shallowMount(LubanCard, { props: { title: 'Test' } });
    expect(w.html()).toBeTruthy();
  });
});
