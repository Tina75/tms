module.exports = {
  baseUrl: './',
  assetsDir: 'static',
  chainWebpack: config => {
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
        target: ' http://yapi.yundada56.com/mock/214',
        ws: false,
        changOrigin: true
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    externals: {
      'area-data': 'AreaData',
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'iview': 'iview',
      'lodash': '_'
    }
  }
}
