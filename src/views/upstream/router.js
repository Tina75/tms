import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main/Main.vue'
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    {
      /** 上游来单 */
      'path': '',
      'component': Main,
      'redirect': '/upstream',
      'children': [
        /** 首页 */
        {
          'name': 'upstream',
          'path': '/upstream',
          'component': () => import(/* webpackChunkName: "upstream" */'./index.vue'),
          'meta': {
            'icon': 'shangyoulaidan',
            'title': '上游来单',
            'powerCode': 110000,
            'notCache': true
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
