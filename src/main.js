import Vue from 'vue'
import iView from 'iview'
import App from './app.vue'
import router from './router'
import store from './store/index'
import VueMeta from 'vue-meta'
import EmaProxy from 'ema-proxy'
import VueToast from '@/libs/plugins/vue-toast.js'
import VueConfig from '@/libs/plugins/vue-config.js'
import './libs/js/ga.js' // GA打点统计配置与上报方法封装,

require('./permission')
require('intersection-observer')
require('./libs/js/filter')
require('./libs/js/date')
require('./assets/css/iview/iview.css')
require('./assets/css/tms/iconfont.css')
require('./assets/css/quill/quill.core.css')

// 处理没有被vue捕获的全局异常
window.addEventListener('error', e => {
  Vue.$reportError(e.error)
})

const errorHandler = (error, vm) => {
  console.error(error)
  vm.$reportError(error)
}
Vue.config.productionTip = false
Vue.config.errorHandler = errorHandler
Vue.prototype.$throw = error => {
  errorHandler(error, this)
}

// Meta自设置
Vue.use(VueMeta)
// iView引入
Vue.use(iView)
// 全局提示框
Vue.use(VueToast)
Vue.use(VueConfig)
window.EMA = new EmaProxy()
var appData = { router, store }
/**
 * 1. 来源于官网【注册】按钮跳转过滤,#/?mode=signup
 * 2. 来源于货主版注册完跳转过来;?from=shipper
 */
appData.render = h => h(App)

new Vue(appData).$mount('#app')
