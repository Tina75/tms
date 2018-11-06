import Vue from 'vue'
import router from '@/router'
import VueAnalytics from 'vue-analytics'

// 使用GA
Vue.use(VueAnalytics, {
  id: 'UA-128241354-1',
  router,
  set: [ { field: 'hostname', value: window.location.origin } ],
  autoTracking: {
    // 对于没有被vue errorHandler捕获的异常进行上报
    exception: true,
    exceptionLogs: process.env.NODE_ENV !== 'production', // 异常log打印
    debug: {
      enabled: process.env.NODE_ENV !== 'production'
    },
    shouldRouterUpdate (to, from) {
      return to.path !== from.path
    },
    transformQueryString: false
  }
})
