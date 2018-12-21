import Main from '@/views/main/Main.vue'

export default [
  /** ************************ 报表 */
  {
    'name': 'oilCard',
    'path': '/oilCard',
    'component': Main,
    'meta': {
      'icon': 'baobiaoguanli',
      'title': '油卡管理',
      'powerCode': 0
    },
    'children': [
      {
        'name': 'oil-list',
        'path': 'oil-list',
        'component': () => import(/* webpackChunkName: "oil-list" */'./pages/oil-list.vue'),
        'meta': {
          'title': '油卡列表',
          'powerCode': 0

        }
      },
      {
        'name': 'used-list',
        'path': 'used-list',
        'component': () => import(/* webpackChunkName: "used-list" */'./pages/used-list.vue'),
        'meta': {
          'title': '油卡使用记录',
          'powerCode': 0

        }
      }
    ]
  }
]
