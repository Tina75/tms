import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main/Main.vue'
Vue.use(Router)

export default[
  {
    'path': '/set-up',
    'component': Main,
    'redirect': '/set-up/index',
    'children': [
      {
        'path': 'index',
        'name': 'set-up',
        'component': () => import(/* webpackChunkName: "setting" */'./pages/index.vue'),
        'meta': {
          'title': '设置',
          'icon': 'shezhi',
          'powerCode': 150000

        }
      }
    ]
  }
]
