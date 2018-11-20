import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './register';

Vue.config.productionTip = false;

window.router = router;
window.store = store;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
