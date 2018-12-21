import Vue from 'vue'
import Router from 'vue-router'
import Main from '../main/Main.vue'
Vue.use(Router)

export default [
  /** 运输管理 */
  {
    'path': '/transport',
    'component': Main,
    'meta': {
      'icon': 'huoyuanguanli',
      'powerCode': 120000,
      'title': '运输管理'
    },
    'children': [
      {
        'name': 'transport-dispatch',
        'path': 'dispatch',
        'component': () => import(/* webpackChunkName: "transport-dispatch" */'./views/transport/dispatch.vue'),
        'meta': {
          'powerCode': 110300,
          'title': '调度工作台'
        }
      },
      {
        'name': 'order-pickup',
        'path': 'pickupOrder',
        'component': () => import(/* webpackChunkName: "transport-pickup" */'./views/transport/pickupOrder.vue'),
        'meta': {
          'powerCode': 120200,
          title: '提货管理'
        }
      },
      {
        'name': 'detailPickup',
        'path': 'detail/detailPickup',
        'component': () => import(/* webpackChunkName: "transport-detailPickup" */'./views/transport/detail/detailPickup.vue'),
        'meta': {
          'hideInMenu': true,
          'powerCode': 120200,
          'title': '提货详情'
        }
      },
      {
        'name': 'order-transport',
        'path': 'waybill',
        'component': () => import(/* webpackChunkName: "transport-waybill" */'./views/transport/waybill.vue'),
        'meta': {
          'title': '送货管理',
          'powerCode': 120100
        }
      },
      {
        'name': 'detailFeright',
        'path': 'detail/detailFreight',
        'component': () => import(/* webpackChunkName: "transport-detailFreight" */'./views/transport/detail/detailFreight.vue'),
        'meta': {
          'hideInMenu': true,
          'title': '送货管理',
          'powerCode': 120100
        }
      },
      {
        'name': 'order-abnormal',
        'path': 'abnormalOrder',
        'component': () => import(/* webpackChunkName: "transport-abnormal" */'./views/transport/abnormalOrder.vue'),
        'meta': {
          'powerCode': 120400,
          'title': '异常管理'
        }
      },
      {
        'name': 'order-receipt',
        'path': 'receipt',
        'component': () => import(/* webpackChunkName: "order-receipt" */'./views/transport/receipt.vue'),
        'meta': {
          'powerCode': 120500,
          'title': '回单管理'
        }
      }
    ]
  }
]
