import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import useUserStore from '@/stores/user';
import Song from '@/components/SongComponent.vue';

const HomeView = () => import('@/views/HomeView.vue');
const ManageView = () => import('@/views/ManageView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');
const AboutView = () => import('@/views/AboutView.vue');

const routes: readonly RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: HomeView,
  },
  {
    name: 'about',
    path: '/about',
    component: AboutView,
  },
  {
    name: 'manage',
    path: '/manage-music',
    component: ManageView,
    beforeEnter: (to, from, next) => {
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/manage',
    redirect: { name: 'manage' },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song,
  },
  {
    path: '/:catchAll(.*)*',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const store = useUserStore();
  if (store.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
