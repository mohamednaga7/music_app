<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <upload-component ref="upload" :addSong="addSong"></upload-component>
      </div>

      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, i) in songs"
              :key="song.docId"
              :song="song"
              :updateSong="updateSong"
              :removeSong="removeSong"
              :index="i"
              :updateUnsavedFlag="updateUnsavedFlag"
            ></composition-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UploadComponent from '@/components/UploadComponent.vue';
import { auth, songsCollection } from '@/includes/firebase';
import type { Song } from '@/types/Song';
import CompositionItem from '@/components/CompositionItem.vue';
import { onBeforeRouteLeave } from 'vue-router';

const songs = ref<Song[]>([]);
const unsavedFlag = ref<boolean>(false);

const updateSong = async (
  index: number,
  values: {
    modified_name: string;
    genre?: string;
  }
) => {
  songs.value[index].modified_name = values.modified_name;
  songs.value[index].genre = values.genre;
};
const removeSong = (i: number) => {
  songs.value.splice(i, 1);
};

const addSong = (document: any) => {
  const song = {
    ...(document.data() as Song),
    docId: document.id,
  };

  songs.value.push(song);
};

const updateUnsavedFlag = (value: boolean) => {
  unsavedFlag.value = value;
};

const fetchSongs = async () => {
  const snapshot = await songsCollection
    .where('uid', '==', auth.currentUser?.uid)
    .get();

  snapshot.forEach(addSong);
};

fetchSongs();

onBeforeRouteLeave((to, from, next) => {
  if (!unsavedFlag.value) {
    next();
  } else {
    const leave = confirm(
      'You have unsaved changes. Are you sure you want to leave?'
    );
    next(leave);
  }
});
</script>
