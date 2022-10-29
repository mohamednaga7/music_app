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

<script setup lang="ts">
import { songsCollection, storage } from '@/includes/firebase';
import type { Song } from '@/types/Song';
import { defineProps, ref } from 'vue';

export interface CompositionItemProps {
  song: Song;
  updateSong: (
    index: number,
    values: { modified_name: string; genre?: string }
  ) => void;
  removeSong: (index: number) => void;
  index: number;
  updateUnsavedFlag?: (flag: boolean) => void;
}

const props = defineProps<CompositionItemProps>();

const showForm = ref<boolean>(false);
const schema = {
  modified_name: 'required',
  genre: 'alpha_spaces',
};

const in_submission = ref<boolean>(false);
const show_alert = ref<boolean>(false);
const alert_variant = ref<string>('bg-blue-500');
const alert_message = ref<string>('Please wait! Updating song info.');

const edit = async (values: { modified_name: string; genre?: string }) => {
  in_submission.value = true;
  show_alert.value = true;
  alert_variant.value = 'bg-blue-500';
  alert_message.value = 'Please wait! Updating song info.';
  try {
    await songsCollection.doc(props.song.docId).update({
      modified_name: values.modified_name,
      genre: values.genre || '',
    });
  } catch (e) {
    in_submission.value = false;
    alert_variant.value = 'bg-red-500';
    alert_message.value = 'Something went wrong! Try again later';
    return;
  }

  await props.updateSong(props.index, values);
  showForm.value = false;

  in_submission.value = false;
  alert_variant.value = 'bg-green-500';
  alert_message.value = 'Success!';
};
const deleteSong = async () => {
  const storageRef = storage.ref();
  const songRef = storageRef.child(`songs/${props.song.original_name}`);

  await songRef.delete();

  await songsCollection.doc(props.song.docId).delete();

  props.removeSong(props.index);
};
</script>

<style lang="scss" scoped></style>
