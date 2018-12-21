import Main from '@/views/main/Main.vue'

export default[
  {
    'path': '/set-up',
    'component': Main,
    'redirect': '/set-up/index',
    'children': [
      {
        'path': 'index',
        'name': 'set-up',
        'component': () => import(/* webpackChunkName: "setting" */'./pages/index.vue'),
        'meta': {
          'title': '设置',
          'icon': 'shezhi',
          'powerCode': 150000

        }
      }
    ]
  }
]
