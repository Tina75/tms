import modules from './store'
import Main from '@/views/main/Main.vue'
import store from '@/store/index.js'

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
          'powerCode': 190200
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
        'name': 'car-repair-details',
        'component': () => import(/* webpackChunkName: "car-repair-details" */'./pages/car-repair-details'),
        'meta': {
          'hideInMenu': true,
          'title': '维修保养详情',
          'powerCode': 190300,
          'notCache': true

        }
      },
      {
        'path': 'insurance',
        'name': 'owned-insurance',
        'component': () => import(/* webpackChunkName: "owned-insurance" */'./pages/insurance.vue'),
        'meta': {
          'title': '车辆保险',
          'powerCode': 190400
        }
      },
      {
        'path': 'insurance-details',
        'name': 'insurance-details',
        'component': () => import(/* webpackChunkName: "insurance-details" */'./pages/insurance-details.vue'),
        'meta': {
          'hideInMenu': true,
          'title': '车辆保险',
          'powerCode': 190400,
          'notCache': true
        }
      },
      {
        'path': 'check',
        'name': 'owner-check',
        'component': () => import(/* webpackChunkName: "owned-check" */'./pages/check.vue'),
        'meta': {
          'title': '车辆年检',
          'powerCode': 190500
        }
      },
      {
        'path': 'check-details',
        'name': 'check-details',
        'component': () => import(/* webpackChunkName: "check-details" */'./pages/check-details.vue'),
        'meta': {
          'hideInMenu': true,
          'title': '车辆年检',
          'powerCode': 190500,
          'notCache': true
        }
      },
      {
        'path': 'tyre',
        'name': 'owner-tyre',
        'component': () => import(/* webpackChunkName: "owned-tyre" */'./pages/tyre.vue'),
        'meta': {
          'title': '轮胎管理',
          'powerCode': 190600
        }
      },
      {
        'path': 'tyre-details',
        'name': 'tyre-details',
        'component': () => import(/* webpackChunkName: "tyre-details" */'./pages/tyre-details.vue'),
        'meta': {
          'hideInMenu': true,
          'title': '轮胎管理',
          'powerCode': 190600,
          'notCache': true
        }
      }
    ]
  }
]
store.registerModule('company', { ...modules })
