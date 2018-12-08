import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Register from './register';

Vue.config.productionTip = false;

const register = new Register();

window.router = router;
window.store = store;

router.beforeEach(async (to, from, next) => {
  const { path } = to;
  const module = path.split('/')[1];
  if (register.modules.has(module)) {
    next();
  } else {
    await register.get(module);
    next({
      path,
      replace: true,
    });
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
