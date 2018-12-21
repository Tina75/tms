import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main/Main.vue'
Vue.use(Router)

export default[
  /** 自有车管理 */
  {
    'name': 'owned',
    'path': '/owned-vehicle',
    'component': Main,
    'meta': {
      'icon': 'ico-truck',
      'powerCode': 190000,
      'title': '自有车管理'
    },
    'children': [
      {
        'path': 'driver',
        'name': 'owned-driver',
        'component': () => import(/* webpackChunkName: "owned-driver" */'./pages/driver.vue'),
        'meta': {
          'title': '司机管理',
          'powerCode': 190100

        }
      },
      {
        'path': 'driver-details',
        'name': 'driver-details',
        'component': () => import(/* webpackChunkName: "owned-driver-details" */'./pages/driver-details.vue'),
        'meta': {
          'hideInMenu': true,
          'title': '司机详情',
          'powerCode': 190100,
          'notCache': true

        }
      },
      {
        'path': 'car',
        'name': 'owned-car',
        'component': () => import(/* webpackChunkName: "owned-car" */'./pages/car.vue'),
        'meta': {
          'title': '车辆管理',
          'powerCode': 190200

        }
      },
      {
        'path': 'car-details',
        'name': 'car-details',
        'component': () => import(/* webpackChunkName: "owned-car-details" */'./pages/car-details.vue'),
        'meta': {
          'hideInMenu': true,
          'title': '车辆详情',
          'powerCode': 190200,
          'notCache': true
        }
      },
      {
        'path': 'repair',
        'name': 'owned-repair',
        'component': () => import(/* webpackChunkName: "owned-repair" */'./pages/repair.vue'),
        'meta': {
          'title': '维修保养',
          'powerCode': 190300

        }
      },
      {
        'path': 'car-repair-details',
        'name': 'owner-carrepair-details',
        'component': () => import(/* webpackChunkName: "owned-repaire-details" */'./pages/car-repair-details.vue'),
        'meta': {
          'hideInMenu': true,
          'title': '维修详情',
          'powerCode': 190300,
          'notCache': true
        }
      }
    ]
  }
]
