import Vue from 'vue'
import iView from 'iview'
import App from './app.vue'
import Login from './login.vue'
import router from './router'
import store from './store'
import VueMeta from 'vue-meta'
import './libs/js/ga.js' // GA打点统计配置与上报方法封装
import EmaProxy from 'ema-proxy'
import Toast from '@/components/toast/index'
import { number2chinese } from '@/libs/js/util'

number2chinese(1203000.456)
number2chinese(120309850)
number2chinese(120300850)
number2chinese(100000010)
number2chinese(10001)
number2chinese(11111)
number2chinese(111111)
number2chinese(11111.11)
number2chinese(11.01)
number2chinese(11.10)
number2chinese(11.00)
number2chinese(11)

require('intersection-observer')
require('./libs/js/filter')
require('./libs/js/date')
require('./assets/css/iview/iview.css')
require('./assets/css/tms/iconfont.css')
require('./assets/css/quill/quill.core.css')

const errorHandler = (error, vm) => {
  vm.$reportError(error)
}

Vue.config.productionTip = false
Vue.config.errorHandler = errorHandler
Vue.prototype.$throw = error => errorHandler(error, this)

// Meta自设置
Vue.use(VueMeta)
// iView引入
Vue.use(iView)
// 全局提示框
Vue.prototype.$Toast = Toast
window.EMA = new EmaProxy()
var appData = { router, store }
var islogin = localStorage.getItem('tms_is_login')
if (window.location.hash === '#/?mode=signup' || !islogin) {
  appData.render = h => h(Login)
} else {
  appData.render = h => h(App)
}
new Vue(appData).$mount('#app')
