import NProgress from 'nprogress';

export default (router: any) => {
  router.beforeEach((to: string, from: string, next: () => void) => {
    NProgress.start();
    next();
  });
  router.afterEach(NProgress.done);
};
