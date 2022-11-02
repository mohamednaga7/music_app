import AboutView from '@/views/AboutView.vue';
import { describe, expect, test } from 'vitest';
import { shallowMount } from '@vue/test-utils';

describe('About.vue', () => {
  test('renders inner text', () => {
    const wrapper = shallowMount(AboutView);

    expect(wrapper.text()).toContain('about');
  });
});
