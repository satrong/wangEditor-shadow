/**
 * @description webpack 配置，生产环境
 * @author wangfupeng
 */

const { smart } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssToJsModuleWebpackPlugin = require('./cssToJsModule')
const CommonConf = require('./webpack.common')
const { distPath } = require('./myPath')

module.exports = smart(CommonConf, {
    mode: 'production',
    output: {
        filename: '[name].js',
        path: distPath,
        library: 'wangEditor',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    // plugins: [new CleanWebpackPlugin()], // 一定要注释掉，否则会将 min js 文件清空掉 ！！！
    devtool: 'source-map',
    optimization: {
        minimize: false, // 非压缩
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'index.css',
        }),
        new CssToJsModuleWebpackPlugin({
            cssFile: 'index.css',
            placeholder: '__CSS_TO_JS_MODULE',
            jsFile: 'style.js',
        }),
    ],
})
