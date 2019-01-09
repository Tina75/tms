import Main from '@/views/main/Main.vue'

export default [
  /** ************************ 报表 */
  {
    'name': 'report',
    'path': '/report',
    'component': Main,
    'meta': {
      'icon': 'baobiaoguanli',
      'title': '报表',
      'powerCode': 180000
    },
    'children': [
      {
        'name': 'report-operate',
        'path': 'operate',
        'component': () => import(/* webpackChunkName: "report-operate" */'./pages/operate.vue'),
        'meta': {
          'title': '运营报表',
          'powerCode': 180100

        }
      },
      {
        'name': 'report-total',
        'path': 'total',
        'component': () => import(/* webpackChunkName: "report-total" */'./pages/total.vue'),
        'meta': {
          'title': '营业额汇总表',
          'powerCode': 180200

        }
      },
      {
        'name': 'report-profit',
        'path': 'profit',
        'component': () => import(/* webpackChunkName: "report-profit" */'./pages/profit.vue'),
        'meta': {
          'title': '利润报表',
          'powerCode': 180300

        }
      },
      {
        'name': 'report-car',
        'path': 'report-car',
        'component': () => import(/* webpackChunkName: "report-car" */'./pages/car.vue'),
        'meta': {
          'title': '自有车出车统计',
          'powerCode': 180400

        }
      },
      {
        'name': 'report-driver',
        'path': 'report-driver',
        'component': () => import(/* webpackChunkName: "report-driver" */'./pages/driver.vue'),
        'meta': {
          'title': '自有司机出车统计',
          'powerCode': 180500

        }
      }
    ]
  }
]
