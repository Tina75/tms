import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main/Main.vue'
Vue.use(Router)

export default[
  /** 公司管理 */
  {
    'path': '/company',
    'component': Main,
    'meta': {
      'title': '公司管理',
      'icon': 'gongsiguanli',
      'powerCode': 140000

    },
    'children': [
      {
        'name': 'company-staff',
        'path': 'staff-manage',
        'component': () => import(/* webpackChunkName: "company-staff" */'./pages/staff-manage.vue'),
        'meta': {
          'title': '员工管理',
          'powerCode': 140200

        }
      },
      {
        'name': 'company-role',
        'path': 'role-manage',
        'component': () => import(/* webpackChunkName: "company-role" */'./pages/role-manage.vue'),
        'meta': {
          'title': '角色管理',
          'powerCode': 140100

        }
      },
      {
        'name': 'company-setting',
        'path': 'setting',
        'component': () => import(/* webpackChunkName: "company-setting" */'./pages/setting.vue'),
        'meta': {
          'title': '公司设置',
          'powerCode': 140100

        }
      }
    ]
  }
]
