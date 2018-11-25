/*
 * @Author: linshuohao
 * @Date: 2018-11-19 22:49:44
 * @Last Modified by: linshuohao
 * @Last Modified time: 2018-11-25 14:28:17
 */
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const config = require('./config.json');

const resolve = dir => path.join(__dirname, dir);

module.exports = {
    baseUrl: config.name, // 根域上下文目录
    outputDir: resolve(`../../dist/${config.name}`), // 构建输出目录
    configureWebpack: (config) => {
        config.externals = {
            vue: 'Vue',
            'element-ui': 'ELEMENT',
            vuex: 'Vuex',
            'vue-router': 'VueRouter',
            axios: 'axios',
        };
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
