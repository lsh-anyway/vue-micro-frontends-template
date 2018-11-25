/*
 * @Author: linshuohao
 * @Date: 2018-11-19 22:49:44
 * @Last Modified by: linshuohao
 * @Last Modified time: 2018-11-25 10:27:06
 */
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const baseURI = isDev ? '' : './';
const proxy = require('../config/proxy.json');

const resolve = dir => path.join(__dirname, dir);

module.exports = {
    baseUrl: `${baseURI}`, // 根域上下文目录
    outputDir: resolve(`../dist/app`), // 构建输出目录
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
        publicPath: '/',
        open: true,
        host: '0.0.0.0',
        port: 8000,
        https: false,
        hotOnly: false,
        proxy,
    },
};
