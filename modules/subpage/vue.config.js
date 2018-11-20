/*
 * @Author: linshuohao
 * @Date: 2018-11-19 22:49:44
 * @Last Modified by: linshuohao
 * @Last Modified time: 2018-11-20 22:13:05
 */
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const config = require('./config.json');

const resolve = dir => path.join(__dirname, dir);

module.exports = {
    baseUrl: config.name, // 根域上下文目录
    outputDir: resolve(`../dist/${config.name}`), // 构建输出目录
    assetsDir: 'static', // 静态资源目录 (js, css, img, fonts)
    lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
    runtimeCompiler: true, // 运行时版本是否需要编译
    transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: true, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    configureWebpack: (config) => {
        if (!isDev && process.argv[6]) {
            config.output.library = 'SC';
            config.output.umdNamedDefine = true;
            config.output.libraryExport = 'default';
        }
        config.externals = {
            vue: 'Vue',
            'element-ui': 'ELEMENT',
            vuex: 'Vuex',
            'vue-router': 'VueRouter',
            axios: 'axios',
        };
    },

    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('./src'))
            .set('@c', resolve('./src/components'))
            .set('@scss', resolve('./src/styles'))
            .set('common', resolve('./src/common'));
        config.plugin('provide').use(new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
        }));
    },
    css: {
        sourceMap: isDev,
        loaderOptions: {
            css: {
                localIdentName: '[name]-[hash]',
                camelCase: 'only',
            },
        },
    },
    parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
    devServer: {
        publicPath: '/' + config.name,
        open: false,
        host: '0.0.0.0',
        port: config.port,
        https: false,
        hotOnly: false,
        before: (app) => {
        },
    },
};
