<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong"></app-upload>
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

<script lang="ts">
import { defineComponent } from 'vue';
import AppUpload from '@/components/Upload.vue';
import { auth, songsCollection } from '@/includes/firebase';
import type { Song } from '@/types/Song';
import CompositionItem from '@/components/CompositionItem.vue';
// import useUserStore from '@/stores/user';

export default defineComponent({
  name: 'app-manage',
  components: { AppUpload, CompositionItem },
  data(): {
    songs: Song[];
    unsavedFlag: boolean;
  } {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    const snapshot = await songsCollection
      .where('uid', '==', auth.currentUser?.uid)
      .get();

    snapshot.forEach(this.addSong);
  },
  methods: {
    updateSong(
      index: number,
      values: {
        modified_name: string;
        genre?: string;
      }
    ) {
      this.songs[index].modified_name = values.modified_name;
      this.songs[index].genre = values.genre;
    },
    removeSong(i: number) {
      this.songs.splice(i, 1);
    },
    addSong(document: any) {
      const song = {
        ...(document.data() as Song),
        docId: document.id,
      };

      this.songs.push(song);
    },
    updateUnsavedFlag(value: boolean) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      next(leave);
    }
  },
  //   beforeRouteEnter(to, from, next) {
  //     const store = useUserStore();

  //     if (store.userLoggedIn) {
  //       next();
  //     } else {
  //       next({ name: 'home' });
  //     }
  //   },
});
</script>
