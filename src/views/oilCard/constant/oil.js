/* 按钮表格变量 */
// 油卡列表按钮
import { CARDTYPELIST, ISSUERLIST, STATUSLIST } from '../constant/enum'
export const OILBTN = vm => [
  {
    name: '新增',
    code: 0,
    func: () => {
      vm.add()
    }
  },
  {
    name: '停用',
    code: 0,
    func: () => {
      vm.operate()
    }
  },
  {
    name: '启用',
    code: 0,
    func: () => {
      vm.operate()
    }
  }
]
// 油卡使用记录按钮
export const USEDBTN = vm => [
  {
    name: '导出',
    code: 0,
    func: () => {
      vm.export()
    }
  }
]

export const oilTableBtn = vm => [
  {
    name: '分配',
    key: 'canAssigin',
    code: 0,
    funName: 'assign',
    func: () => {
      console.log(vm)
      vm.assign()
    }
  },
  {
    name: '充值',
    key: 'canRecharge',
    code: 0,
    funName: 'recharge',
    func: () => {
      console.log(vm)
      vm.recharge()
    }
  },
  {
    name: '加油',
    key: 'canRefuel',
    code: 0,
    funName: 'refuel',
    func: () => {
      vm.refuel()
    }
  },
  {
    name: '转账',
    key: 'canTransfer',
    code: 0,
    funName: 'transfer',
    func: () => {
      vm.transfer()
    }
  },
  {
    name: '修改',
    key: 'canUpdate',
    code: 0,
    funName: 'update',
    func: () => {
      vm.update()
    }
  },
  {
    name: '回收',
    key: 'canRecover',
    code: 0,
    funName: 'recover',
    func: () => {
      vm.recover()
    }
  }
]
// 油卡列表
export const oilTableColumns = vm => [
  {
    type: 'selection',
    width: 50,
    align: 'center'
    // fixed: 'left'
  },
  {
    title: '操作',
    key: 'orderNo',
    // width: 180,
    // fixed: 'left',
    render: (h, params) => {
      let renderHtml = []
      let DropdownItem = []
      oilTableBtn(vm).forEach(item => {
        if (params.row[item.key] === true && vm.hasPower(item.code)) {
          if (renderHtml.length < 3) {
            renderHtml.push(
              h('a', {
                props: {
                  type: 'text'
                },
                style: {
                  marginRight: '8px',
                  color: '#00A4BD'
                },
                on: {
                  click: () => {
                    console.log(vm)
                    item.func()
                  }
                }
              }, item.name)
            )
          } else {
            DropdownItem.push(h('DropdownItem', {
              style: {
                color: '#00A4BD'
              },
              props: {
                name: item.funName
              }
            }, item.name))
          }
        }
      })
      if (DropdownItem.length > 0) {
        renderHtml.push(h(
          'Dropdown',
          {
            props: { trigger: 'click' },
            on: {
              'on-click': (value) => {
                vm[value]()
              }
            }
          },
          [
            h('a', { style: { color: '#00A4BD' } }, '更多'),
            h('DropdownMenu', { slot: 'list' }, DropdownItem)
          ])
        )
      }
      return h('div', renderHtml)
    }
  },
  {
    title: '卡号',
    key: 'number',
    render: (h, params) => {
      return h('a', {
        props: {
          type: 'text'
        },
        style: {
          color: '#00A4BD',
          cursor: 'pointer'
        },
        on: {
          click: () => {
            vm.toDetail(params)
          }
        }
      }, params.row.number)
    }
  },
  {
    title: '主卡号',
    key: 'primaryCardNumber'
  },
  {
    title: '类型',
    key: 'type',
    filters: CARDTYPELIST,
    filterMethod (value, row) {
      return value === row.type
    },
    render: (h, p) => {
      return h('span', vm.typeToName(p.row.type) ? vm.typeToName(p.row.type) : '-')
    }
  },
  {
    title: '持卡人',
    key: 'driverName'
  },
  {
    title: '余额',
    key: 'amount',
    minWidth: 120,
    render: (h, params) => {
      return h('span', typeof params.row.amount === 'number' ? (params.row.amount / 100).toFixed(2) : '0.00')
    }
  },
  {
    title: '状态',
    key: 'status',
    filters: STATUSLIST,
    filterMethod (value, row) {
      return value === row.status
    },
    render: (h, p) => {
      return h('span', {
        class: vm.statusClass(p.row.status)
      }, vm.statusToName(p.row.status) ? vm.statusToName(p.row.status) : '-')
    }
  },
  {
    title: '发卡机构',
    key: 'issuer',
    filters: ISSUERLIST,
    filterMethod (value, row) {
      return value === row.issuer
    },
    render: (h, p) => {
      return h('span', vm.issuerToName(p.row.issuer) ? vm.issuerToName(p.row.issuer) : '-')
    }
  },
  {
    title: '绑定车辆',
    key: 'truckNo'
  },
  {
    title: '所属承运商',
    key: 'carrierName'
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (h, params) => {
      return h('span', params.row.createTime ? new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
    }
  }
]

// 油卡使用记录列表
export const usedTableColumns = vm => [
  {
    title: '卡号',
    key: 'number',
    render: (h, params) => {
      return h('a', {
        props: {
          type: 'text'
        },
        style: {
          color: '#00A4BD',
          cursor: 'pointer'
        },
        on: {
          click: () => {
            vm.toDetail()
          }
        }
      }, params.row.number)
    }
  },
  {
    title: '主卡号',
    key: 'primaryCardNumber'
  },
  {
    title: '类型',
    key: 'type',
    filters: CARDTYPELIST,
    filterMethod (value, row) {
      return value === row.type
    },
    render: (h, p) => {
      return h('span', vm.typeToName(p.row.type) ? vm.typeToName(p.row.type) : '-')
    }
  },
  {
    title: '操作',
    key: 'type',
    render: (h, p) => {
      return h('span', vm.typeToName(p.row.type) ? vm.typeToName(p.row.type) : '-')
    }
  },
  {
    title: '修改前金额',
    key: 'beforeAmount',
    render: (h, params) => {
      return h('span', typeof params.row.beforeAmount === 'number' ? (params.row.beforeAmount / 100).toFixed(2) : '0.00')
    }
  },
  {
    title: '修改后金额',
    key: 'afterAmount',
    render: (h, params) => {
      return h('span', typeof params.row.afterAmount === 'number' ? (params.row.afterAmount / 100).toFixed(2) : '0.00')
    }
  },
  {
    title: '发卡机构',
    key: 'issuer',
    render: (h, p) => {
      return h('span', vm.issuerToName(p.row.issuer) ? vm.issuerToName(p.row.issuer) : '-')
    }
  },
  {
    title: '持卡人',
    key: 'driverName'
  },
  {
    title: '绑定车辆',
    key: 'truckNo'
  },
  {
    title: '所属承运商',
    key: 'carrierName'
  },
  {
    title: '系统操作时间',
    key: 'systemTime',
    render: (h, params) => {
      return h('span', params.row.systemTime ? new Date(params.row.systemTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
    }
  },
  {
    title: '实际发生时间',
    key: 'operateDate',
    render: (h, params) => {
      return h('span', params.row.operateDate ? new Date(params.row.operateDate).Format('yyyy-MM-dd hh:mm:ss') : '-')
    }
  },
  {
    title: '操作人',
    key: 'operator'
  },
  {
    title: '转入卡号',
    key: 'toCardNumber'
  },
  {
    title: '转出卡号',
    key: 'fromCardNumber'
  },
  {
    title: '押金',
    key: 'deposit',
    render: (h, params) => {
      return h('span', typeof params.row.deposit === 'number' ? (params.row.deposit / 100).toFixed(2) : '0.00')
    }
  },
  {
    title: '修改前卡号',
    key: 'beforeCardNumber'
  },
  {
    title: '操作备注',
    key: 'remark'
  }
]
