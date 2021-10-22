/**
 * 生成资源到 output 目录之后，将 index.css 的内容写入到 style.js
 */

const fs = require('fs')
const path = require('path')

class CssToJsModuleWebpackPlugin {
    /**
     * @typedef {object} options
     * @property {string} options.cssFile
     * @property {string} options.jsFile
     * @property {string} options.placeholder
     *
     * @param {options} options
     */
    constructor(options) {
        this.options = options
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('CssToJsModuleWebpackPlugin', (compilation, callback) => {
            const assets = compilation.assets
            if (assets[this.options.jsFile] && assets[this.options.cssFile]) {
                const style = this.getSource(assets[this.options.cssFile])
                let content = this.getSource(assets[this.options.jsFile])
                content = content.replace(this.options.placeholder, JSON.stringify(style))
                fs.writeFileSync(
                    path.join(compilation.options.output.path, this.options.jsFile),
                    content,
                    'utf8'
                )
            }
            callback()
        })
    }

    getSource(assetsData) {
        if (Array.isArray(assetsData.children)) {
            return this.getSource(assetsData.children[0])
        }
        if (typeof assetsData.source === 'function') {
            return assetsData.source()
        }
        if (assetsData._value) {
            return assetsData._value
        }
    }
}

module.exports = CssToJsModuleWebpackPlugin
