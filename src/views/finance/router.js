import Main from '@/views/main/Main.vue'

export default [
  /** ************************ 财务 */
  {
    'name': 'finance',
    'path': '/finance',
    'component': Main,
    'meta': {
      'icon': 'caiwuguanli',
      'powerCode': 170000,
      'title': '财务'
    },
    'children': [
      {
        'name': 'finance-sender',
        'path': 'sender',
        'component': () => import(/* webpackChunkName: "finance-sender" */'./pages/sender.vue'),
        'meta': {
          'powerCode': 170100,
          'title': '发货方对账'
        }
      },
      {
        'name': 'finance-carrier',
        'path': 'carrier',
        'component': () => import(/* webpackChunkName: "finance-carrier" */'./pages/carrier.vue'),
        'meta': {
          'powerCode': 170200,
          'title': '承运商对账'
        }
      },
      {
        'name': 'finance-collect-fee',
        'path': 'collectFee',
        'component': () => import(/* webpackChunkName: "finance-collectFee" */'./pages/collectFee.vue'),
        'meta': {
          'powerCode': 170500,
          'title': '代收货款对账'
        }
      },
      {
        'name': 'finance-return-fee',
        'path': 'returnFee',
        'component': () => import(/* webpackChunkName: "finance-returnFee" */'./pages/returnFee.vue'),
        'meta': {
          'powerCode': 170600,
          'title': '返现对账'
        }
      },
      {
        'name': 'finance-rules',
        'path': 'rules',
        'component': () => import(/* webpackChunkName: "finance-rules" */'./pages/rules.vue'),
        'meta': {
          'powerCode': 170400,
          'title': '计费规则'
        }
      },
      {
        'name': 'writtenOffDetail',
        'path': 'writtenOffDetail',
        'component': () => import(/* webpackChunkName: "finance-writtern-off" */'./pages/writtenOffDetail.vue'),
        'meta': {
          'hideInMenu': true,
          'powerCode': 170000,
          'notCache': true,
          'title': '核销详情'
        }
      }
    ]
  }
]
