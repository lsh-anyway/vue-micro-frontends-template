import { Route } from 'vue-router';

// const modules = require('../modules.json');

// modules.forEach((val:string) => {
//     const script = document.createElement('script');
//     script.type = "text/javascript";
//     script.async = true;
//     script.onload = () => {};
//     script.onerror = () => {
//         console.log(`找不到${val}模块`);
//     };
//     script.src = process.env.NODE_ENV === 'development' ? `../${val}/app.js` : `../${val}/app.umd.js`;
//     document.body.appendChild(script);
// });

export default class Register {
    private modules: string[] = ['', 'index'];
    /**
     * 检测模块是否加载，若未加载则动态加载
     * @param route 路由
     */
    public get(route: Route) {
        const { path } = route;
        const module = path.split('/')[1];
        if (!this.modules.includes(module)) {
            this.register(module);
        }
    }

    /**
     * 动态加载模块js
     * @param module 模块名
     */
    private register(module: string) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => {
            console.log(`${module}模块已加载`);
            this.modules.push(module);
        };
        script.onerror = () => {
            console.error(`找不到${module}模块`);
        };
        script.src =
            process.env.NODE_ENV === 'development'
                ? `../${module}/app.js?v=${new Date().getTime()}`
                : `../${module}/app.umd.js?v=${new Date().getTime()}`;
        document.body.appendChild(script);
    }
}
