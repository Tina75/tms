import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main/Main.vue'
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    /** ************************ 报表 */
    {
      'name': 'report',
      'path': '/report',
      'component': Main,
      'meta': {
        'icon': 'baobiaoguanli',
        'title': '报表',
        'powerCode': 180000
      },
      'children': [
        {
          'name': 'report-operate',
          'path': 'operate',
          'component': () => import(/* webpackChunkName: "report-operate" */'./pages/operate.vue'),
          'meta': {
            'title': '运营报表',
            'powerCode': 180100

          }
        },
        {
          'name': 'report-total',
          'path': 'total',
          'component': () => import(/* webpackChunkName: "report-total" */'./pages/total.vue'),
          'meta': {
            'title': '营业额汇总表',
            'powerCode': 180200

          }
        },
        {
          'name': 'report-profit',
          'path': 'profit',
          'component': () => import(/* webpackChunkName: "report-profit" */'./pages/profit.vue'),
          'meta': {
            'title': '利润报表',
            'powerCode': 180300

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
