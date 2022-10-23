<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.docId } }"
        href="#"
        class="font-bold block text-gray-600"
        >{{ song.modified_name }}</router-link
      >
      <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link
        custom
        :to="{ name: 'song', params: { id: song.docId }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.comment_count }}
        </span></router-link
      >
    </div>
  </li>
</template>

<script lang="ts">
import type { Song } from '@/types/Song';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppSongItem',
  props: {
    song: {
      required: true,
      type: Object as () => Song,
    },
  },
});
</script>

<style lang="scss" scoped></style>
