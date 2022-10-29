import { createApp, type App as VueApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';
import { VeeValidatePlugin } from './includes/validation';
import { auth } from './includes/firebase';
import { Icon } from './directives/icon';
import { registerSW } from 'virtual:pwa-register';

import GlobalComponents from './includes/_globals';

import progressBar from './includes/progress-bar';

import 'nprogress/nprogress.css';

registerSW({
  immediate: true,
});

progressBar(router);

let app: VueApp<Element>;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(GlobalComponents);
    app.directive('icon', Icon);

    app.mount('#app');
  }
});
