import Main from '@/views/main/Main.vue'

export default [
  /** ************************ 油卡 */
  {
    'name': 'oilCard',
    'path': '/oilCard',
    'component': Main,
    'meta': {
      'icon': 'ico-card',
      'title': '油卡管理',
      'powerCode': 160000
    },
    'children': [
      {
        'name': 'oil-list',
        'path': 'oil-list',
        'component': () => import(/* webpackChunkName: "oil-list" */'./pages/oil-list.vue'),
        'meta': {
          'title': '油卡列表',
          'powerCode': 160100
        }
      },
      {
        'name': 'used-list',
        'path': 'used-list',
        'component': () => import(/* webpackChunkName: "used-list" */'./pages/used-list.vue'),
        'meta': {
          'title': '油卡使用记录',
          'powerCode': 160200
        }
      },
      {
        'name': 'oilList-detail',
        'path': 'oilList-detail',
        'component': () => import(/* webpackChunkName: "oilList-detail" */'./detail/oilList-detail.vue'),
        'meta': {
          'hideInMenu': true,
          'notCache': true,
          'title': '油卡详情',
          'powerCode': 160100
        }
      }
    ]
  }
]
