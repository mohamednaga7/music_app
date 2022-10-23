import { createApp, type App as VueApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';
import { VeeValidatePlugin } from './includes/validation';
import { auth } from './includes/firebase';
import { Icon } from './directives/icon';

let app: VueApp<Element>;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);

    app.directive('icon', Icon);

    app.mount('#app');
  }
});
