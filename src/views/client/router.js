import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main/Main.vue'
Vue.use(Router)

export default[
  /** 客户管理 */
  {
    'name': '客户管理',
    'path': '/client',
    'component': Main,
    'meta': {
      'icon': 'yonghuguanli',
      'powerCode': 130000,
      'title': '客户管理'
    },
    'children': [
      {
        'name': 'client-sender',
        'path': 'sender',
        'component': () => import(/* webpackChunkName: "client-sender" */'./views/client/pages/sender.vue'),
        'meta': {
          'powerCode': 130100,
          'title': '发货方管理'

        }
      },
      {
        'name': 'client-carrier',
        'path': 'carrier',
        'component': () => import(/* webpackChunkName: "client-carrier" */'./views/client/pages/carrier.vue'),
        'meta': {
          'powerCode': 130200,
          'title': '承运商管理'

        }
      },
      {
        'name': 'client-transfer',
        'path': 'transfer',
        'component': () => import(/* webpackChunkName: "client-transfer" */'./views/client/pages/transfer.vue'),
        'meta': {
          'powerCode': 130300,
          'title': '外转方管理'
        }
      }
    ]
  }
]
