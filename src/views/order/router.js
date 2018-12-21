import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/main/Main.vue'
Vue.use(Router)

export default[
  {
    'component': Main,
    'path': '/order',
    'meta': {
      'title': '受理开单',
      'icon': 'shoulikaidan',
      'powerCode': 100000
    },
    children: [
      {
        'name': 'order-create',
        'path': 'create',
        'component': () => import(/* webpackChunkName: "order-create" */'./create/index.vue'),
        'meta': {
          'title': '手工开单',
          'powerCode': 100100
        }
      },
      {
        'name': 'order-update',
        'path': 'update',
        'component': () => import(/* webpackChunkName: "order-update" */'./update/index.vue'),
        'meta': {
          'hideInMenu': true,
          'title': '修改订单',
          'powerCode': 100301
        }
      },
      {
        'name': 'order-import',
        'path': 'import',
        'component': () => import(/* webpackChunkName: "order-import" */'./import/index.vue'),
        'meta': {
          'title': '批量导入',
          'powerCode': 100200
        }
      },
      {
        'name': 'order-management',
        'path': '/order-management/order',
        'component': () => import(/* webpackChunkName: "order-management" */'../order-management/order.vue'),
        'meta': {
          'powerCode': 100300,
          'title': '订单管理'
        }
      },
      {
        'name': 'order-management-detail',
        'path': '/order-management/detail',
        'component': () => import(/* webpackChunkName: "order-detail" */'../order-management/detail.vue'),
        'meta': {
          'hideInMenu': true,
          'powerCode': 100300,
          'title': '订单详情'
        }
      }
    ]
  }
]
