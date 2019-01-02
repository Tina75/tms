/* 按钮表格变量 */
// 油卡列表按钮
import { CARDTYPELIST, ISSUERLIST, STATUSLIST } from '../constant/enum'
export const OILBTN = vm => [
  {
    name: '新增',
    code: 160101,
    func: () => {
      vm.add()
    }
  },
  {
    name: '停用',
    code: 160108,
    func: () => {
      vm.stop()
    }
  },
  {
    name: '启用',
    code: 160109,
    func: () => {
      vm.start()
    }
  },
  {
    name: '导出',
    code: 160110,
    func: () => {
      vm.export()
    }
  }
]
// 油卡使用记录按钮
export const USEDBTN = vm => [
  {
    name: '导出',
    code: 160201,
    func: () => {
      vm.export()
    }
  }
]

export const oilTableBtn = vm => [
  {
    name: '分配',
    key: 'canAssign',
    code: 160103,
    funName: 'assign',
    func: (p) => {
      vm.assign(p)
    }
  },
  {
    name: '充值',
    key: 'canRecharge',
    code: 160104,
    funName: 'recharge',
    func: (p) => {
      vm.recharge(p)
    }
  },
  {
    name: '加油',
    key: 'canRefuel',
    code: 160105,
    funName: 'refuel',
    func: (p) => {
      vm.refuel(p)
    }
  },
  {
    name: '转账',
    key: 'canTransfer',
    code: 160106,
    funName: 'transfer',
    func: (p) => {
      vm.transfer(p)
    }
  },
  {
    name: '修改',
    key: 'canUpdate',
    code: 160102,
    funName: 'update',
    func: (p) => {
      vm.update(p)
    }
  },
  {
    name: '回收',
    key: 'canRecover',
    code: 160107,
    funName: 'recover',
    func: (p) => {
      vm.recover(p)
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
    width: 120,
    // fixed: 'left',
    render: (h, params) => {
      let renderHtml = []
      let DropdownItem = []
      oilTableBtn(vm).forEach(item => {
        if (params.row[item.key] === true && vm.hasPower(item.code)) {
          if (renderHtml.length < 2) {
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
                    item.func(params)
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
            style: { display: 'inline-block' },
            on: {
              'on-click': (value) => {
                vm[value](params)
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
    width: 180,
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
      }, vm.cardFormat(params.row.number))
    }
  },
  {
    title: '主卡号',
    width: 180,
    key: 'primaryCardNumber',
    render: (h, p) => {
      return h('span', vm.cardFormat(p.row.primaryCardNumber))
    }
  },
  {
    title: '类型',
    key: 'type',
    width: 70,
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
    key: 'driverName',
    render: (h, p) => {
      // p.row.driverName ? (p.row.driverName + ' ' + p.row.driverPhone)
      return h('div', p.row.driverName ? [h('p', p.row.driverName), h('p', p.row.driverPhone)] : '-')
    }
  },
  {
    title: '余额',
    key: 'amount',
    render: (h, params) => {
      return h('span', typeof params.row.amount === 'number' ? (params.row.amount / 100).toFixed(2) : '0.00')
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
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
    width: 100,
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
    maxWidth: 100,
    key: 'truckNo'
  },
  {
    title: '所属承运商',
    key: 'carrierName'
  },
  {
    title: '创建时间',
    maxWidth: 140,
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
    width: 200,
    render: (h, params) => {
      return h('span', vm.cardFormat(params.row.number))
    }
  },
  {
    title: '主卡号',
    width: 200,
    key: 'primaryCardNumber',
    render: (h, p) => {
      return h('span', vm.cardFormat(p.row.primaryCardNumber))
    }
  },
  {
    title: '类型',
    key: 'cardType',
    width: 150,
    filters: CARDTYPELIST,
    filterMethod (value, row) {
      return value === row.cardType
    },
    render: (h, p) => {
      return h('span', vm.typeToName(p.row.cardType) ? vm.typeToName(p.row.cardType) : '-')
    }
  },
  {
    title: '操作',
    key: 'type',
    width: 150,
    render: (h, p) => {
      return h('span', vm.operateType(p.row.type) ? vm.operateType(p.row.type) : '-')
    }
  },
  {
    title: '修改前金额',
    width: 150,
    key: 'beforeAmount',
    render: (h, params) => {
      return h('span', typeof params.row.beforeAmount === 'number' ? (params.row.beforeAmount / 100).toFixed(2) : '0.00')
    }
  },
  {
    title: '修改后金额',
    width: 150,
    key: 'afterAmount',
    render: (h, params) => {
      return h('span', typeof params.row.afterAmount === 'number' ? (params.row.afterAmount / 100).toFixed(2) : '0.00')
    }
  },
  {
    title: '发卡机构',
    key: 'issuer',
    width: 150,
    render: (h, p) => {
      return h('span', vm.issuerToName(p.row.issuer) ? vm.issuerToName(p.row.issuer) : '-')
    }
  },
  {
    title: '持卡人',
    width: 300,
    key: 'driverName',
    render: (h, p) => {
      return h('div', p.row.driverName ? [h('p', p.row.driverName), h('p', p.row.driverPhone)] : '-')
    }
  },
  {
    title: '绑定车辆',
    width: 150,
    key: 'truckNo'
  },
  {
    title: '所属承运商',
    width: 300,
    key: 'carrierName'
  },
  {
    title: '系统操作时间',
    width: 300,
    key: 'systemTime',
    render: (h, params) => {
      return h('span', params.row.systemTime ? new Date(params.row.systemTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
    }
  },
  {
    title: '实际发生时间',
    width: 300,
    key: 'operateDate',
    render: (h, params) => {
      return h('span', params.row.operateDate ? new Date(params.row.operateDate).Format('yyyy-MM-dd') : '-')
    }
  },
  {
    title: '操作人',
    width: 300,
    key: 'operator'
  },
  {
    title: '转入卡号',
    width: 300,
    key: 'toCardNumber'
  },
  {
    title: '转出卡号',
    width: 300,
    key: 'fromCardNumber',
    render: (h, p) => {
      return h('span', vm.cardFormat(p.row.fromCardNumber))
    }
  },
  {
    title: '押金',
    width: 300,
    key: 'deposit',
    render: (h, params) => {
      return h('span', typeof params.row.deposit === 'number' ? (params.row.deposit / 100).toFixed(2) : '0.00')
    }
  },
  {
    title: '修改前卡号',
    width: 300,
    key: 'beforeCardNumber',
    render: (h, p) => {
      return h('span', vm.cardFormat(p.row.beforeCardNumber))
    }
  },
  {
    title: '操作备注',
    width: 300,
    key: 'remark'
  }
]
