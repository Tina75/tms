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
        target: 'http://192.168.1.42:8888/bluewhale-line/',
        ws: false,
        changOrigin: true
      }
    }
  },
  configureWebpack: {
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
