import routes from './routers/index';
import module from './store/index';

const {router, store} = window;

router.addRoutes(routes);
store.registerModule('', module);
