import Main from '@/views/main/Main.vue'

export default [
  {
    /** 上游来单 */
    'path': '',
    'component': Main,
    'redirect': '/upstream',
    'children': [
      /** 首页 */
      {
        'name': 'upstream',
        'path': '/upstream',
        'component': () => import(/* webpackChunkName: "upstream" */'./index.vue'),
        'meta': {
          'icon': 'shangyoulaidan',
          'title': '上游来单',
          'powerCode': 110000,
          'notCache': true
        }
      }
    ]
  }
]
