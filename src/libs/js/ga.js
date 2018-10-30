import Vue from 'vue'
import router from '@/router'
import VueAnalytics from 'vue-analytics'

// 使用GA
Vue.use(VueAnalytics, {
  id: 'UA-128241354-1',
  router,
  autoTracking: {
    exception: true, // 异常上传
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
