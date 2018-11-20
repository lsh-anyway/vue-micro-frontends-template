/*
 * @Author: linshuohao
 * @Date: 2018-11-19 22:49:44
 * @Last Modified by: linshuohao
 * @Last Modified time: 2018-11-19 23:29:03
 */
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const baseURI = isDev ? '' : './';

const resolve = dir => path.join(__dirname, dir);

const fileDir = process.argv[6] || process.argv.slice(3);

module.exports = {
    baseUrl: `subpage`, // 根域上下文目录
    outputDir: `dist/${fileDir}`, // 构建输出目录
    // pages: {
    //     index: {
    //         // page 的入口
    //         entry: 'src/main.ts',
    //         // 模板来源
    //         template: 'public/index.html',
    //         // 在 dist/index.html 的输出
    //         filename: 'index.html',
    //         // 当使用 title 选项时，
    //         // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    //         title: 'Index Page',
    //         // 在这个页面中包含的块，默认情况下会包含
    //         // 提取出来的通用 chunk 和 vendor chunk。
    //         chunks: ['chunk-vendors', 'chunk-common', 'index']
    //     },
    //     // 当使用只有入口的字符串格式时，
    //     // 模板会被推导为 `public/subpage.html`
    //     // 并且如果找不到的话，就回退到 `public/index.html`。
    //     // 输出文件名会被推导为 `subpage.html`。
    //     subpage: 'src/modules/subpage/main.ts'
    // },
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
        publicPath: '/subpage',
        open: false,
        host: '0.0.0.0',
        port: 7900,
        https: false,
        hotOnly: false,
        before: (app) => {},
    },
};
