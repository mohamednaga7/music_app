<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">
        {{ song.modified_name }}
      </h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
      ></div>
      <vee-form
        :validation-schema="schema"
        :initial-value="song"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag && updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag && updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          type="submit"
          :disabled="in_submission"
          class="py-1.5 mr-2 px-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          type="button"
          :disabled="in_submission"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = !showForm"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script lang="ts">
import { songsCollection, storage } from '@/includes/firebase';
import type { Song } from '@/types/Song';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'composition-item',
  props: {
    song: {
      type: Object as () => Song,
      required: true,
    },
    updateSong: {
      type: Function,
      default: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        index: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        values: { modified_name: string; genre?: string }
      ) => {},
      required: true,
    },
    removeSong: {
      type: Function,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      default: (index: number) => {},
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      default: (value: boolean) => {},
      required: false,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces',
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! Updating song info.',
    };
  },
  methods: {
    async edit(values: { modified_name: string; genre?: string }) {
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_message = 'Please wait! Updating song info.';
      try {
        await songsCollection.doc(this.song.docId).update({
          modified_name: values.modified_name,
          genre: values.genre || '',
        });
      } catch (e) {
        this.in_submission = false;
        this.alert_variant = 'bg-red-500';
        this.alert_message = 'Something went wrong! Try again later';
        return;
      }

      await this.updateSong(this.index, values);
      this.showForm = false;

      this.in_submission = false;
      this.alert_variant = 'bg-green-500';
      this.alert_message = 'Success!';
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.original_name}`);

      await songRef.delete();

      await songsCollection.doc(this.song.docId).delete();

      this.removeSong(this.index);
    },
  },
});
</script>

<style lang="scss" scoped></style>
