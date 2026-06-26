import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanTextarea from './LubanTextArea.vue';

describe('LubanTextArea', () => {
  it('renders textarea element', () => {
    const wrapper = mount(LubanTextArea);
    expect(wrapper.find('textarea').exists() || wrapper.findComponent({ name: 'ElInput' }).exists()).toBe(true);
  });

  it('applies placeholder', () => {
    const wrapper = mount(LubanTextArea, { props: { placeholder: 'Enter text' } });
    expect(wrapper.html()).toContain('Enter text');
  });
});
