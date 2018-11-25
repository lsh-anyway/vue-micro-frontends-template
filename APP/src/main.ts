import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Register from './register';

Vue.config.productionTip = false;

const register = new Register();

window.router = router;
window.store = store;

router.beforeEach((to, from, next) => {
  register.get(to);
  next();
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
