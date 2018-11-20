import routes from './routers/index';
import module from './store/index';
import VueRouter from "vue-router";
import {Store} from "vuex";

const config = require('../config.json');
const {router, store} = window;

declare global {
    interface Window {
        router: VueRouter;
        store: Store<{}>;
    }
}

router.addRoutes(routes);
store.registerModule(config.name, module);
