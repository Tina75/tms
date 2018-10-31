import Vue from 'vue'
import router from '@/router'
import VueAnalytics from 'vue-analytics'

// 使用GA
Vue.use(VueAnalytics, {
  id: 'UA-128241354-1',
  router,
  autoTracking: {
    shouldRouterUpdate (to, from) {
      return to.path !== from.path
    },
    transformQueryString: false
  }
})
