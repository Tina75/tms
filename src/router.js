import Vue from 'vue'
import Router from 'vue-router'
import PageRouter from './components/PageRouter.vue'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    // 需要做强缓存的页面需要在这里配置路由
    {
      path: '/home',
      component: () => import('@/views/home/index')
    },
    {
      path: '/order-management/order',
      component: () => import('@/views/order-management/order')
    },
    {
      path: '/info/info',
      component: () => import('@/views/info/info')
    },
    {
      path: '/order/create',
      component: () => import('@/views/order/create')
    },
    {
      path: '/transport/waybill',
      component: () => import('@/views/transport/waybill')
    },
    {
      path: '/:name/:name1/:name2',
      component: PageRouter
    },
    {
      path: '/:name/:name1',
      component: PageRouter
    },
    {
      path: '/:name',
      component: PageRouter
    },
    {
      path: '/',
      component: PageRouter
    }
  ]
})
