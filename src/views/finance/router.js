import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main/Main.vue'
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    /** ************************ 财务 */
    {
      'name': 'finance',
      'path': '/finance',
      'component': Main,
      'meta': {
        'icon': 'caiwuguanli',
        'powerCode': 170000,
        'title': '财务'
      },
      'children': [
        {
          'name': 'finance-sender',
          'path': 'sender',
          'component': () => import(/* webpackChunkName: "finance-sender" */'./sender.vue'),
          'meta': {
            'powerCode': 170100,
            'title': '发货方对账'
          }
        },
        {
          'name': 'finance-carrier',
          'path': 'carrier',
          'component': () => import(/* webpackChunkName: "finance-carrier" */'./carrier.vue'),
          'meta': {
            'powerCode': 170200,
            'title': '承运商对账'
          }
        },
        {
          'name': 'finance-collect-fee',
          'path': 'collectFee',
          'component': () => import(/* webpackChunkName: "finance-collectFee" */'./collectFee.vue'),
          'meta': {
            'powerCode': 170500,
            'title': '代收货款对账'
          }
        },
        {
          'name': 'finance-return-fee',
          'path': 'returnFee',
          'component': () => import(/* webpackChunkName: "finance-returnFee" */'./returnFee.vue'),
          'meta': {
            'powerCode': 170600,
            'title': '返现对账'
          }
        },
        {
          'name': 'finance-rules',
          'path': 'rules',
          'component': () => import(/* webpackChunkName: "finance-rules" */'./rules.vue'),
          'meta': {
            'powerCode': 170400,
            'title': '计费规则'
          }
        }
      ]
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (window.localStorage.tms_is_login || to.path === '/') next()
//   else next('/')
// })

export default router
