import Main from '@/views/main/Main.vue'

export default [
  {
    /** 上游来单 */
    'path': '/upstream',
    'component': Main,
    'children': [
      /** 首页 */
      {
        'name': 'upstream',
        'path': '',
        'component': () => import(/* webpackChunkName: "upstream" */'./pages/index.vue'),
        'meta': {
          'icon': 'shangyoulaidan',
          'title': '上游来单',
          'powerCode': 110000
        }
      },
      {
        'name': 'upstreamDetail',
        'path': 'upstreamDetail',
        'component': () => import(/* webpackChunkName: "upstream-detail" */'./detail/detail.vue'),
        'meta': {
          'hideInMenu': true,
          'notCache': true,
          'title': '上游来单详情',
          'powerCode': 0
        }
      }
    ]
  }
]
