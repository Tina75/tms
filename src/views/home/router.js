import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main/Main.vue'
Vue.use(Router)

export default[
  {
    /** 首页 */
    'path': '',
    'component': Main,
    'redirect': '/home',
    'children': [
      /** 首页 */
      {
        'name': 'home',
        'path': '/home',
        'component': () => import(/* webpackChunkName: "home" */'./index.vue'),
        'meta': {
          'icon': 'shouye',
          'title': '首页',
          'powerCode': 0,
          'notCache': true
        }
      }
    ]
  }
]
