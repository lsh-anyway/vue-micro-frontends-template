import VueRouter from 'vue-router';
import {Store} from "vuex";

declare global {
    interface Window {
        router: VueRouter;
        store: Store<object>;
    }
}
