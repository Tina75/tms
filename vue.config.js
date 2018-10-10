module.exports = {
  baseUrl: './',
  assetsDir: 'static',
  chainWebpack: config => {
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
    inline: true,
    proxy: {
      '/': {
        // target: 'http://yapi.yundada56.com/mock/214',
        target: '//192.168.1.49:5656/dolphin-web/',
        ws: false,
        changOrigin: true
      }
    }
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
