# vue-micro-frontends-template

## 构建目标

1. 子项目不输出任何 HTML 页面，只输出资源文件
2. 主项目不包含业务，只为子项目提供注册，合并等功能
3. 主项目根据路由变更自动加载子项目生成的资源文件

## 构建思路

1. 通过`vue-cli-service build --target lib --name myLib [entry]`命令将子项目打包成 umd 模块
2. 使用 vue-router 的`router.addRoutes`动态添加路由规则
3. 使用 Vuex.Store 的`registerModule`方法注册动态模块
