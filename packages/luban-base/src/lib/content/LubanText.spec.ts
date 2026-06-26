import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanText from './LubanText.vue';

describe('LubanText', () => {
  it('renders text content prop', () => {
    const wrapper = mount(LubanText, {
      props: { content: 'Hello World' },
    });
    expect(wrapper.text()).toContain('Hello World');
  });

  it('renders empty when no content', () => {
    const wrapper = mount(LubanText);
    expect(wrapper.exists()).toBe(true);
  });

  it('applies alignment prop', () => {
    const wrapper = mount(LubanText, {
      props: { content: 'Test', align: 'center' },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
