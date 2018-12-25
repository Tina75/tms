import Main from '@/views/main/Main.vue'

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
        'component': () => import(/* webpackChunkName: "client-sender" */'./pages/sender.vue'),
        'meta': {
          'powerCode': 130100,
          'title': '发货方管理'
        }
      },
      {
        'name': 'sender-info',
        'path': 'sender-info',
        'component': () => import(/* webpackChunkName: "client-sender" */'./pages/sender-info.vue'),
        'meta': {
          'powerCode': 130100,
          'notCache': true,
          'hideInMenu': true,
          'title': '发货方详情'

        }
      },
      {
        'name': 'carrier',
        'path': 'carrier',
        'component': () => import(/* webpackChunkName: "client-carrier" */'./pages/carrier.vue'),
        'meta': {
          'powerCode': 130200,
          'title': '承运商管理'

        }
      },
      {
        'name': 'carrier-info',
        'path': 'carrier-info',
        'component': () => import(/* webpackChunkName: "client-carrier" */'./pages/carrier-info.vue'),
        'meta': {
          'hideInMenu': true,
          'notCache': true,
          'powerCode': 130200,
          'title': '承运商详情'
        }
      },
      {
        'name': 'client-transfer',
        'path': 'transfer',
        'component': () => import(/* webpackChunkName: "client-transfer" */'./pages/transfer.vue'),
        'meta': {
          'powerCode': 130300,
          'title': '外转方管理'
        }
      }
    ]
  }
]
