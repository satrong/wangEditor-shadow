/**
 * @description webpack 配置，生产环境
 * @author wangfupeng
 */

// const path = require('path')
const { smart } = require('webpack-merge')
const CommonConf = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { distPath } = require('./myPath')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssToJsModuleWebpackPlugin = require('./cssToJsModule')

// 包体积分析
const isAnalyzer = process.env.NODE_ENV === 'production_analyzer'

const plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
        filename: 'index.min.css',
    }),
    new CssToJsModuleWebpackPlugin({
        cssFile: 'index.min.css',
        placeholder: '__CSS_TO_JS_MODULE',
        jsFile: 'style.min.js',
    }),
]
if (isAnalyzer) {
    plugins.push(new BundleAnalyzerPlugin())
}

module.exports = smart(CommonConf, {
    mode: 'production',
    output: {
        filename: '[name].min.js',
        path: distPath,
        library: 'wangEditor',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    plugins,
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new UglifyPlugin({
                parallel: true,
                cache: true,
                extractComments: false,
            }),
        ],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
})
