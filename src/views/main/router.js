import Main from './Main.vue'
export default [
  {
    /** 加载页，中转页 */
    'path': '/loading',
    'component': Main,
    'meta': {
      'hideInMenu': true,
      'powerCode': 0
    },
    'children': [
      /** 首页 */
      {
        'name': 'loading',
        'path': '',
        'component': () => import(/* webpackChunkName: "loading" */'./pages/loading.vue'),
        'meta': {
          'title': '加载中..'
        }
      }
    ]
  }
]
