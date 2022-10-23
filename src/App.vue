<script lang="ts">
import AppHeaderVue from '@/components/AppHeader.vue';
import AppAuthVue from '@/components/AppAuth.vue';
import useUserStore from '@/stores/user';
import { defineComponent } from 'vue';
import { mapWritableState } from 'pinia';
import { auth } from './includes/firebase';
import Player from './components/Player.vue';
export default defineComponent({
  name: 'App',
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn']),
  },
  components: {
    AppHeader: AppHeaderVue,
    AppAuth: AppAuthVue,
    AppPlayer: Player,
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  },
});
</script>

<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player />
  <app-auth />
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
