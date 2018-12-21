import Vue from 'vue'
import Router from 'vue-router'
import LoginLayout from './login.vue'
import Main from './views/main/Main.vue'
import home from '@/views/home/router'
import order from '@/views/order/router'
import waybill from '@/views/transport/router'
import helper from '@/views/helper/router'
import company from '@/views/company/router'
import information from '@/views/information/router'
import report from '@/views/report/router'
import setting from '@/views/set-up/router'
import client from '@/views/client/router'
import finance from '@/views/finance/router'
import upstream from '@/views/upstream/router'
import owned from '@/views/owned-vehicle/router'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: __dirname,
  routes: [

    /** 登陆 */
    {
      'path': '/login',
      'component': LoginLayout,
      'meta': {
        'hideInMenu': true,
        'powerCode': 0
      },
      'children': [
        {
          'path': '',
          'name': 'Login',
          'component': () => import(/* webpackChunkName: "sign-in" */'./views/login/index.vue')
        }
      ]
    },
    /** 注册 */
    {
      'path': '/register',
      'component': LoginLayout,
      'meta': {
        'hideInMenu': true,
        'powerCode': 0
      },
      'children': [
        {
          'path': '',
          'name': 'SignUp',
          'component': () => import(/* webpackChunkName: "sign-up" */'./views/login/sign-up.vue')
        }
      ]
    },
    /** 找回密码 */
    {
      'path': '/findback',
      'component': LoginLayout,
      'meta': {
        'hideInMenu': true,
        'powerCode': 0
      },
      'children': [
        {
          'path': '',
          'name': 'FindBack',
          'component': () => import(/* webpackChunkName: "findback" */'./views/login/find-back.vue')
        }
      ]
    },
    ...home,
    ...upstream,
    ...order,
    ...waybill,
    ...finance,
    ...report,
    ...client,
    ...owned,
    ...company,
    ...setting,
    ...information,
    ...helper,
    {
      path: '/404',
      component: Main,
      meta: {
        'hideInMenu': true
      },
      children: [
        {
          'name': 'Error404',
          'path': '',
          'component': () => import(/* webpackChunkName: "not-found" */'./views/error-page/404.vue'),
          'meta': {
            'title': '未找到页面',
            'powerCode': 0,
            'hideInMenu': true
          }
        }
      ]
    },
    {
      path: '/500',
      component: Main,
      meta: {
        'hideInMenu': true
      },
      children: [
        {
          'name': 'Error500',
          'path': '',
          'component': () => import(/* webpackChunkName: "server-error" */'./views/error-page/500.vue'),
          'meta': {
            'title': '服务出粗了',
            'powerCode': 0,
            'hideInMenu': true
          }
        }
      ]
    },
    // 未匹配到的到404
    { path: '*', redirect: '/404', 'meta': { hideInMenu: true, powerCode: 0 } }
  ]
})
// 同步store和路由
// router.beforeEach((to, from, next) => {
//   if (window.localStorage.tms_is_login || to.path === '/') next()
//   else next('/')
// })

export default router
