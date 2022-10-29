<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="playerStore.newSong(song!)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i
            class="fas"
            :class="{
              'fa-pause':
                playerStore.current_song?.docId === route.params.id &&
                playerStore.playing,
              'fa-play':
                !playerStore.current_song ||
                playerStore.current_song.docId !== route.params.id ||
                !playerStore.playing,
            }"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song?.modified_name }}</div>
          <div>{{ song?.genre }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title"
            >Comments ({{ song?.comment_count || 0 }})</span
          >
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form
            :validation-schema="schema"
            @submit="addComment"
            v-if="userStore.userLoggedIn"
          >
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in comments"
        :key="comment.docId"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.readableDate }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { auth, songsCollection, commentsCollection } from '@/includes/firebase';
import type { Song } from '@/types/Song';
import { ref, watch } from 'vue';
import useUserStore from '@/stores/user';
import { usePlayerStore } from '@/stores/player';
import moment from 'moment';

import type { Comment } from '@/types/Comment';
import { useRoute, useRouter } from 'vue-router';

const song = ref<Song | null>(null);
const schema = {
  comment: 'required|min:3',
};
const comments = ref<Comment[]>([]);
const comment_in_submission = ref<boolean>(false);
const comment_show_alert = ref<boolean>(false);
const comment_alert_variant = ref<string>('bg-blue-500');
const comment_alert_message = ref<string>(
  'Please wait! Your comment is being submitted'
);
const sort = ref<'1' | '2'>('1');

const playerStore = usePlayerStore();

const userStore = useUserStore();

const route = useRoute();
const router = useRouter();

const addComment = async (
  values: { comment: string },
  { resetForm }: { resetForm: () => void }
) => {
  if (auth.currentUser && auth.currentUser.uid) {
    comment_in_submission.value = true;
    comment_show_alert.value = true;
    comment_alert_variant.value = 'bg-blue-500';
    comment_alert_message.value =
      'Please wait! Your comment is being submitted';
    const comment: Comment = {
      content: values.comment,
      datePosted: new Date().getTime(),
      sid: route.params.id as string,
      name: auth.currentUser.displayName || '',
      uid: auth.currentUser.uid,
    };
    await commentsCollection.add(comment);

    if (song.value) {
      song.value.comment_count += 1;
      await songsCollection.doc(route.params.id as string).update({
        comment_count: song.value.comment_count,
      });
    }

    comment_in_submission.value = false;
    comment_alert_variant.value = 'bg-green-500';
    comment_alert_message.value = 'Comment added!';

    resetForm();
  }
};
const getComments = async () => {
  const snapshots = await commentsCollection
    .orderBy('datePosted', sort.value === '1' ? 'desc' : 'asc')
    .where('sid', '==', route.params.id)
    .get();

  comments.value = [];

  snapshots.forEach((doc) => {
    const data = doc.data() as Comment;
    comments.value.push({
      docId: doc.id,
      ...data,
      readableDate: moment(data.datePosted).format('DD/MM/YYYY HH:mm'),
    });
  });

  commentsCollection
    .orderBy('datePosted', sort.value === '1' ? 'desc' : 'asc')
    .where('sid', '==', route.params.id)
    .onSnapshot((querySnapshot) => {
      comments.value = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Comment;
        comments.value.push({
          docId: doc.id,
          ...data,
          readableDate: moment(data.datePosted).format('DD/MM/YYYY HH:mm'),
        });
      });
    });
};
watch(
  () => sort.value,
  (newVal) => {
    if (newVal === route.query.sort) {
      return;
    }
    router.push({
      query: {
        sort: newVal,
      },
    });

    getComments();
  }
);

(async () => {
  const docSnapshot = await songsCollection
    .doc(route.params.id as string)
    .get();
  if (!docSnapshot.exists) {
    router.push({ name: 'home' });
    return;
  }
  song.value = {
    ...(docSnapshot.data() as Song),
    docId: docSnapshot.id,
  };
  const { sort: routeSort } = route.query;

  sort.value = routeSort === '1' || routeSort === '2' ? routeSort : '1';

  getComments();
})();
</script>

<style lang="scss" scoped></style>
