import SongItem from '@/components/SongItem.vue';
import { describe, expect, test } from 'vitest';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import type { Song } from '@/types/Song';

describe('SongItem.vue', () => {
  test('renders song.displayName', () => {
    const song: Song = { display_name: 'test' } as Song;
    const wrapper = shallowMount(SongItem, {
      props: { song },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
      },
    });

    const compositionAuthor = wrapper.find('.text-gray-500');

    expect(compositionAuthor.text()).toBe(song.display_name);
  });
});
