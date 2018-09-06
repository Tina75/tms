import Vue from 'vue'
import iView from 'iview'
import App from './app.vue'
import Login from './login.vue'
import router from './router'
import store from './store'
import VueMeta from 'vue-meta'
import EmaProxy from 'ema-proxy'
require('./libs/js/filter')
require('./libs/js/date')

Vue.config.productionTip = false

// Meta自设置
Vue.use(VueMeta)
// iView引入
Vue.use(iView)

window.EMA = new EmaProxy()
var appData = {router, store}
var islogin = localStorage.getItem('tms_is_login')
if (islogin) {
  appData.render = h => h(App)
} else {
  appData.render = h => h(Login)
}
new Vue(appData).$mount('#app')
