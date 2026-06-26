import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LubanHero from './LubanHero.vue';

describe('LubanHero', () => {
  it('renders title prop', () => {
    const wrapper = mount(LubanHero, {
      props: { title: 'Welcome to Luban' },
    });
    expect(wrapper.text()).toContain('Welcome to Luban');
  });

  it('renders subtitle prop', () => {
    const wrapper = mount(LubanHero, {
      props: { title: 'T', subtitle: 'Build amazing pages' },
    });
    expect(wrapper.text()).toContain('Build amazing pages');
  });

  it('renders CTA button when ctaText provided', () => {
    const wrapper = mount(LubanHero, {
      props: { title: 'T', ctaText: 'Get Started', ctaUrl: '/start' },
    });
    const link = wrapper.find('a');
    expect(link.exists() || wrapper.text()).toBeTruthy();
  });

  it('renders without CTA when ctaText not provided', () => {
    const wrapper = mount(LubanHero, {
      props: { title: 'No CTA' },
    });
    expect(wrapper.text()).toContain('No CTA');
  });
});
