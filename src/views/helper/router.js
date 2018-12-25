import Main from '@/views/main/Main.vue'

export default[
  {
    'path': '/help',
    'component': Main,
    'redirect': '/help/index',
    'children': [
      {
        'name': 'help-center',
        'path': 'index',
        'component': () => import(/* webpackChunkName: "help-center" */'./pages/index.vue'),
        'meta': {
          'title': '帮助',
          'icon': 'bangzhuzhongxin',
          'powerCode': 0
        }
      },
      {
        'path': 'process',
        'name': 'process-center',
        'component': () => import(/* webpackChunkName: "process-center" */'./pages/process.vue'),
        'meta': {
          'title': '业务流程',
          'hideInMenu': true,
          'powerCode': 0
        }
      }
    ]

  }
]
