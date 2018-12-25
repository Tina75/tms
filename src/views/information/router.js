import Main from '@/views/main/Main.vue'

export default[
  {
    'path': '/information',
    'component': Main,
    'redirect': '/information/message',
    'children': [
      {
        'name': 'message',
        'path': 'index',
        'component': () => import(/* webpackChunkName: "message" */'./pages/index.vue'),
        'meta': {
          'title': '消息',
          'powerCode': 0,
          'icon': 'xiaoxishezhi'
        }
      },
      {
        'name': 'message-info',
        'path': 'message-info',
        'component': () => import(/* webpackChunkName: "message" */'./pages/message-info.vue'),
        'meta': {
          'title': '系统消息',
          'powerCode': 0,
          'hideInMenu': true,
          'notCache': true
        }
      }
    ]
  }
]
