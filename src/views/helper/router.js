import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main/Main.vue'
Vue.use(Router)

export default[
  {
    'path': '/help',
    'component': Main,
    'redirect': '/help/index',
    'children': [
      {
        'name': 'help-center',
        'path': 'index',
        'component': () => import(/* webpackChunkName: "help-center" */'./views/helper/pages/index.vue'),
        'meta': {
          'title': '帮助',
          'icon': 'bangzhuzhongxin',
          'powerCode': 0
        }
      },
      {
        'path': 'process',
        'name': 'process-center',
        'component': () => import(/* webpackChunkName: "process-center" */'./views/helper/pages/process.vue'),
        'meta': {
          'title': '业务流程',
          'hideInMenu': true,
          'powerCode': 0
        }
      }
    ]

  }
]
