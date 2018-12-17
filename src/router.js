import Vue from 'vue'
import Router from 'vue-router'
import LoginLayout from './login.vue'
import Main from './views/main/Main.vue'
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    {
      /** 首页 */
      'path': '',
      'component': Main,
      'redirect': '/home',
      'children': [
        /** 首页 */
        {
          'name': 'home',
          'path': '/home',
          'component': () => import(/* webpackChunkName: "home" */'./views/home/index.vue'),
          'meta': {
            'icon': 'shouye',
            'title': '首页',
            'powerCode': 0
          }
        }
      ]
    },
    /** 登陆 */
    {
      'path': '/login',
      'component': LoginLayout,
      'meta': {
        'hideInMenu': true,
        'powerCode': 0
      },
      'children': [
        {
          'path': '',
          'name': 'login',
          'component': () => import(/* webpackChunkName: "sign-in" */'./views/login/index.vue')
        }
      ]
    },
    /** 注册 */
    {
      'path': '/register',
      'component': LoginLayout,
      'meta': {
        'hideInMenu': true,
        'powerCode': 0
      },
      'children': [
        {
          'path': '',
          'name': 'register',
          'component': () => import(/* webpackChunkName: "sign-up" */'./views/login/sign-up.vue')
        }
      ]
    },
    /** 找回密码 */
    {
      'path': '/findback',
      'component': LoginLayout,
      'meta': {
        'hideInMenu': true,
        'powerCode': 0
      },
      'children': [
        {
          'path': '',
          'name': 'findback',
          'component': () => import(/* webpackChunkName: "findback" */'./views/login/find-back.vue')
        }
      ]
    },
    /** ************************ 受理开单 */
    {
      'component': Main,
      'path': '/order',
      'meta': {
        'title': '受理开单',
        'icon': 'shoulikaidan',
        'powerCode': 100000
      },
      children: [
        {
          'name': 'order-create',
          'path': 'create',
          'component': () => import(/* webpackChunkName: "order-create" */'./views/order/create/index.vue'),
          'meta': {
            'title': '手工开单',
            'powerCode': 100100
          }
        },
        {
          'name': 'order-update',
          'path': 'update',
          'component': () => import(/* webpackChunkName: "order-update" */'./views/order/update/index.vue'),
          'meta': {
            'hideInMenu': true,
            'title': '修改订单',
            'powerCode': 100301
          }
        },
        {
          'name': 'order-import',
          'path': 'import',
          'component': () => import(/* webpackChunkName: "order-import" */'./views/order/import/index.vue'),
          'meta': {
            'title': '批量导入',
            'powerCode': 100200
          }
        },
        {
          'name': 'order-management',
          'path': '/order-management/order',
          'component': () => import(/* webpackChunkName: "order-management" */'./views/order-management/order.vue'),
          'meta': {
            'powerCode': 100300,
            'title': '订单管理'
          }
        }
      ]
    },
    /** 运输管理 */
    {
      'path': '/transport',
      'component': Main,
      'meta': {
        'icon': 'huoyuanguanli',
        'powerCode': 120000,
        'title': '运输管理'
      },
      'children': [
        {
          'name': 'transport-dispatch',
          'path': 'dispatch',
          'component': () => import(/* webpackChunkName: "transport-dispatch" */'./views/transport/dispatch.vue'),
          'meta': {
            'powerCode': 110300,
            'title': '调度工作台'
          }
        },
        {
          'name': 'order-pickup',
          'path': 'pickupOrder',
          'component': () => import(/* webpackChunkName: "transport-pickup" */'./views/transport/pickupOrder.vue'),
          'meta': {
            'powerCode': 120200,
            title: '提货管理'
          }
        },
        {
          'name': 'order-transport',
          'path': 'waybill',
          'component': () => import(/* webpackChunkName: "transport-waybill" */'./views/transport/waybill.vue'),
          'meta': {
            'title': '送货管理',
            'powerCode': 120100
          }
        },
        {
          'name': 'order-abnormal',
          'path': 'abnormalOrder',
          'component': () => import(/* webpackChunkName: "transport-abnormal" */'./views/transport/abnormalOrder.vue'),
          'meta': {
            'powerCode': 120400,
            'title': '异常管理'
          }
        },
        {
          'name': 'order-receipt',
          'path': 'receipt',
          'component': () => import(/* webpackChunkName: "order-receipt" */'./views/order-management/receipt.vue'),
          'meta': {
            'powerCode': 120500,
            'title': '回单管理'
          }
        }
      ]
    },
    /** ************************ 财务 */
    {
      'name': 'finance',
      'path': '/finance',
      'component': Main,
      'meta': {
        'icon': 'caiwuguanli',
        'powerCode': 170000,
        'title': '财务'
      },
      'children': [
        {
          'name': 'finance-sender',
          'path': 'sender',
          'component': () => import(/* webpackChunkName: "finance-sender" */'./views/finance/sender.vue'),
          'meta': {
            'powerCode': 170100,
            'title': '发货方对账'
          }
        },
        {
          'name': 'finance-carrier',
          'path': 'carrier',
          'component': () => import(/* webpackChunkName: "finance-carrier" */'./views/finance/carrier.vue'),
          'meta': {
            'powerCode': 170200,
            'title': '承运商对账'
          }
        },
        {
          'name': 'finance-collectFee',
          'path': 'collectFee',
          'component': () => import(/* webpackChunkName: "finance-collectFee" */'./views/finance/collectFee.vue'),
          'meta': {
            'powerCode': 170500,
            'title': '代收货款对账'
          }
        },
        {
          'name': 'finance-returnfee',
          'path': 'returnFee',
          'component': () => import(/* webpackChunkName: "finance-returnFee" */'./views/finance/returnFee.vue'),
          'meta': {
            'powerCode': 170600,
            'title': '返现对账'
          }
        },
        {
          'name': 'finance-rules',
          'path': 'rules',
          'component': () => import(/* webpackChunkName: "finance-rules" */'./views/finance/rules.vue'),
          'meta': {
            'powerCode': 170400,
            'title': '计费规则'
          }
        }
      ]
    },
    /** ************************ 报表 */
    {
      'name': 'report',
      'path': '/report',
      'component': Main,
      'meta': {
        'icon': 'baobiaoguanli',
        'title': '报表',
        'powerCode': 180000
      },
      'children': [
        {
          'name': 'report-operate',
          'path': 'operate',
          'component': () => import(/* webpackChunkName: "report-operate" */'./views/report/operate.vue'),
          'meta': {
            'title': '运营报表',
            'powerCode': 180100

          }
        },
        {
          'name': 'report-total',
          'path': 'total',
          'component': () => import(/* webpackChunkName: "report-total" */'./views/report/total.vue'),
          'meta': {
            'title': '营业额汇总表',
            'powerCode': 180200

          }
        },
        {
          'name': 'report-profit',
          'path': 'profit',
          'component': () => import(/* webpackChunkName: "report-profit" */'./views/report/profit.vue'),
          'meta': {
            'title': '利润报表',
            'powerCode': 180300

          }
        }
      ]
    },
    /** 客户管理 */
    {
      'name': '客户管理',
      'path': '/client',
      'component': Main,
      'meta': {
        'icon': 'yonghuguanli',
        'powerCode': 130000,
        'title': '客户管理'
      },
      'children': [
        {
          'name': 'client-sender',
          'path': 'sender',
          'component': () => import(/* webpackChunkName: "client-sender" */'./views/client/sender.vue'),
          'meta': {
            'powerCode': 130100,
            'title': '发货方管理'

          }
        },
        {
          'name': 'client-carrier',
          'path': 'carrier',
          'component': () => import(/* webpackChunkName: "client-carrier" */'./views/client/carrier.vue'),
          'meta': {
            'powerCode': 130200,
            'title': '承运商管理'

          }
        },
        {
          'name': 'client-transfer',
          'path': 'transfer',
          'component': () => import(/* webpackChunkName: "client-transfer" */'./views/client/transfer.vue'),
          'meta': {
            'powerCode': 130300,
            'title': '外转方管理'
          }
        }
      ]
    },
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
          'component': () => import(/* webpackChunkName: "owned-driver" */'./views/owned-vehicle/driver.vue'),
          'meta': {
            'title': '司机管理',
            'powerCode': 190100

          }
        },
        {
          'path': 'car',
          'name': 'owned-car',
          'component': () => import(/* webpackChunkName: "owned-car" */'./views/owned-vehicle/car.vue'),
          'meta': {
            'title': '车辆管理',
            'powerCode': 190200

          }
        },
        {
          'path': 'repair',
          'name': 'owned-repair',
          'component': () => import(/* webpackChunkName: "owned-repair" */'./views/owned-vehicle/repair.vue'),
          'meta': {
            'title': '维修保养',
            'powerCode': 190300

          }
        }
      ]
    },
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
          'component': () => import(/* webpackChunkName: "company-staff" */'./views/company/staff-manage.vue'),
          'meta': {
            'title': '员工管理',
            'powerCode': 140200

          }
        },
        {
          'name': 'company-role',
          'path': 'role-manage',
          'component': () => import(/* webpackChunkName: "company-role" */'./views/company/role-manage.vue'),
          'meta': {
            'title': '角色管理',
            'powerCode': 140100

          }
        },
        {
          'name': 'company-setting',
          'path': 'setting',
          'component': () => import(/* webpackChunkName: "company-setting" */'./views/company/setting.vue'),
          'meta': {
            'title': '公司设置',
            'powerCode': 140100

          }
        }
      ]
    },
    {
      'path': '/set-up',
      'component': Main,
      'redirect': '/set-up/index',
      'children': [
        {
          'path': 'index',
          'name': 'setting',
          'component': () => import(/* webpackChunkName: "setting" */'./views/set-up/index.vue'),
          'meta': {
            'title': '设置',
            'icon': 'shezhi',
            'powerCode': 150000

          }
        }
      ]
    },
    {
      'path': '/information',
      'component': Main,
      'redirect': '/information/message',
      'children': [
        {
          'name': 'message',
          'path': 'index',
          'component': () => import(/* webpackChunkName: "message" */'./views/information/index.vue'),
          'meta': {
            'title': '消息',
            'powerCode': 0,
            'icon': 'xiaoxishezhi'
          }
        }
      ]
    },
    {
      'path': '/help',
      'component': Main,
      'redirect': '/help/index',
      'children': [
        {
          'name': 'help-center',
          'path': 'index',
          'component': () => import(/* webpackChunkName: "help-center" */'./views/helper/index.vue'),
          'meta': {
            'title': '帮助',
            'icon': 'bangzhuzhongxin',
            'powerCode': 0
          }
        },
        {
          'path': 'process',
          'name': 'process-center',
          'component': () => import(/* webpackChunkName: "process-center" */'./views/helper/process.vue'),
          'meta': {
            'title': '业务流程',
            'hideInMenu': true,
            'powerCode': 0
          }
        }
      ]

    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (window.localStorage.tms_is_login || to.path === '/') next()
//   else next('/')
// })

export default router
