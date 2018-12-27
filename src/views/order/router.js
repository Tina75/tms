import Main from '@/views/main/Main.vue'

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
      /**
       * 权限待修改
       */
      {
        'name': 'frequent-order',
        'path': 'frequent-order',
        'component': () => import(/* webpackChunkName: "order-detail" */'./frequent-order/index.vue'),
        'meta': {
          'powerCode': 0,
          'title': '常发订单'
        }
      },
      {
        'name': 'frequent-order-detail',
        'path': 'frequent-order-detail',
        'component': () => import(/* webpackChunkName: "order-detail" */'./frequent-order/detail.vue'),
        'meta': {
          'powerCode': 0,
          'hideInMenu': true,
          'title': '常发订单详情'
        }
      },
      {
        'name': 'order-management',
        'path': '/order-management/order',
        'component': () => import(/* webpackChunkName: "order-management" */'./management/order.vue'),
        'meta': {
          'powerCode': 100300,
          'title': '订单管理'
        }
      },
      {
        'name': 'order-management-detail',
        'path': '/order-management/detail',
        'component': () => import(/* webpackChunkName: "order-detail" */'./management/detail.vue'),
        'meta': {
          'notCache': true,
          'hideInMenu': true,
          'powerCode': 100300,
          'title': '订单详情'
        }
      },
      {
        'name': 'management-order-detail',
        'path': '/order-management/order-detail',
        'component': () => import(/* webpackChunkName: "order-detail" */'./management/order-detail.vue'),
        'meta': {
          'notCache': true,
          'hideInMenu': true,
          'powerCode': 100300,
          'title': '订单详情'
        }
      },
      {
        'name': 'management-recept-detail',
        'path': '/order-management/recept-detail',
        'component': () => import(/* webpackChunkName: "recept-detail" */'./management/recept-detail.vue'),
        'meta': {
          'notCache': true,
          'hideInMenu': true,
          'powerCode': 100300,
          'title': '回单详情'
        }
      }
    ]
  }
]
