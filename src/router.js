import Vue from 'vue'
import Router from 'vue-router'
import PageRouter from './components/PageRouter.vue'
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    // 需要做强缓存的页面需要在这里配置路由
    // {
    //   path: '/',
    //   component: () => import('@/views/home/index')
    // },
    // {
    //   path: '/order-management/order',
    //   component: () => import('@/views/order-management/order')
    // },
    // {
    //   path: '/info/info',
    //   component: () => import('@/views/info/info')
    // },
    // {
    //   path: '/order/create',
    //   component: () => import('@/views/order/create')
    // },
    // {
    //   path: '/transport/waybill',
    //   component: () => import('@/views/transport/waybill')
    // },
    // {
    //   path: '/home',
    //   component: () => import('@/views/home/index')
    // },
    {
      path: '/set-up/index',
      component: () => import('@/views/set-up/index')
    },
    {
      path: '/information/index',
      component: () => import('@/views/information/index')
    },
    {
      path: '/information/message-info',
      component: () => import('@/views/information/message-info')
    },
    {
      path: '/helper/index',
      component: () => import('@/views/helper/index')
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

router.beforeEach((to, from, next) => {
  if (window.localStorage.tms_is_login || to.path === '/') next()
  else next('/')
})

export default router
