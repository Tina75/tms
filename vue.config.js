const UglifyPlugin = require('uglifyjs-webpack-plugin')
const uglifyOptions = require('@vue/cli-service/lib/config/uglifyOptions')
const merge = require('webpack-merge')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
module.exports = {
  baseUrl: './',
  assetsDir: 'static',
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 发布时，去除console和debugger信息
      config.optimization.minimizer([
        new UglifyPlugin(merge(uglifyOptions({ productionSourceMap: false }), {
          uglifyOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        }))
      ])
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          iview: {
            name: 'chunk-iview', // 单独将 iview 拆包
            priority: -5, // 权重要大于 vendor 和 app 不然会被打包进 vendor 或者 app
            test: /[\\/]node_modules[\\/]iview[\\/]/
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      })
    }
    // 提取chunk id清单
    config.optimization.runtimeChunk(true)
    config.plugin('script-ext').use(ScriptExtHtmlWebpackPlugin, [{
      inline: /runtime\..*\.js$/
    }]).after('html')
    // config.module
    //   .rule('vue')
    //   .test(/\.vue$/)
    //   .use('iview-loader')
    //   .loader('iview-loader')
    //   .tap(options => {
    //     // 修改它的选项...
    //     return {prefix: false}
    //   })
    //   .end()
    config.plugins.delete('prefetch')
  },
  productionSourceMap: false,
  lintOnSave: true,
  parallel: true,
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8080,
    progress: true,
    inline: true
    // proxy: {
    //   '/': {
    //     // target: 'http://yapi.yundada56.com/mock/214',
    //     target: '//192.168.1.49:5656/dolphin-web/',
    //     ws: false,
    //     changOrigin: true
    //   }
    // }
  },
  configureWebpack: {
    devtool: 'source-map',
    externals: {
      'vue': 'Vue',
      'lodash': '_',
      'BMap': 'BMap'
    }
  },
  transpileDependencies: [
    /\/node_modules\/vue-echarts\//,
    /\/node_modules\/resize-detector\//
  ]
}
