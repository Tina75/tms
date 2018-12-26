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

const oilTableBtn = vm => [
  {
    name: '分配',
    key: 'canAssigin',
    code: 0,
    funName: 'assigin',
    func: () => {
      vm.assigin()
    }
  },
  {
    name: '充值',
    key: 'canRecharge',
    code: 0,
    funName: 'recharge',
    func: () => {
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
                    vm.func()
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
  // {
  //   title: '客户名称',
  //   key: 'shipperCompanyName',
  //   minWidth: 200,
  //   render: (h, p) => {
  //     return h('span', p.row.shipperCompanyName ? p.row.shipperCompanyName : '-')
  //   }
  // },
  // {
  //   title: '对接业务员',
  //   key: 'handlerUserName',
  //   minWidth: 180,
  //   render: (h, params) => {
  //     return h('span', params.row.handlerUserName || '-')
  //   }
  // },
  // {
  //   title: '发货城市',
  //   key: 'departureCityName',
  //   minWidth: 180,
  //   render: (h, params) => {
  //     return h('span', params.row.departureCityName || '-')
  //   }
  // },
  // {
  //   title: '收货城市',
  //   key: 'destinationCityName',
  //   minWidth: 180,
  //   render: (h, params) => {
  //     return h('span', params.row.destinationCityName || '-')
  //   }
  // },
  // {
  //   title: '下单时间',
  //   key: 'createTime',
  //   minWidth: 150,
  //   render: (h, params) => {
  //     return h('span', params.row.createTime ? new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
  //   }
  // },
  // {
  //   title: '发货时间',
  //   key: 'deliveryTime',
  //   minWidth: 150,
  //   render: (h, params) => {
  //     return h('span', params.row.deliveryTime ? new Date(params.row.deliveryTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
  //   }
  // },
  // {
  //   title: '到货时间',
  //   key: 'arriveTime',
  //   minWidth: 150,
  //   render: (h, params) => {
  //     return h('span', params.row.arriveTime ? new Date(params.row.arriveTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
  //   }
  // },
  // {
  //   title: '发货人',
  //   key: 'consignerContact',
  //   minWidth: 180,
  //   tooltip: true,
  //   render: (h, p) => {
  //     return h('span', p.row.consignerContact ? p.row.consignerContact : '-')
  //   }
  // },
  // {
  //   title: '发货人联系号码',
  //   key: 'consignerPhone',
  //   minWidth: 150,
  //   tooltip: true,
  //   render: (h, p) => {
  //     return h('span', p.row.consignerPhone ? p.row.consignerPhone : '-')
  //   }
  // },
  // {
  //   title: '发货地址',
  //   key: 'consignerAddress',
  //   minWidth: 200,
  //   tooltip: true,
  //   render: (h, p) => {
  //     return h('span', p.row.consignerAddress ? p.row.consignerAddress : '-')
  //   }
  // },
  // {
  //   title: '收货人',
  //   key: 'consigneeContact',
  //   minWidth: 180,
  //   tooltip: true,
  //   render: (h, p) => {
  //     return h('span', p.row.consigneeContact ? p.row.consigneeContact : '-')
  //   }
  // }
  // {
  //   title: '收货人联系号码',
  //   key: 'consigneePhone',
  //   minWidth: 150,
  //   tooltip: true,
  //   render: (h, p) => {
  //     return h('span', p.row.consigneePhone ? p.row.consigneePhone : '-')
  //   }
  // },
  // {
  //   title: '收货地址',
  //   key: 'consigneeAddress',
  //   minWidth: 200,
  //   tooltip: true,
  //   render: (h, p) => {
  //     return h('span', p.row.consigneeAddress ? p.row.consigneeAddress : '-')
  //   }
  // },
  // {
  //   title: '结算方式',
  //   key: 'settlementTypeDesc',
  //   minWidth: 120,
  //   render: (h, p) => {
  //     return h('span', p.row.settlementTypeDesc ? p.row.settlementTypeDesc : '-')
  //   }
  // },
  // {
  //   title: '运输费',
  //   key: 'freightFee',
  //   minWidth: 120,
  //   render: (h, params) => {
  //     return h('span', params.row.freightFee ? (params.row.freightFee / 100).toFixed(2) : '-')
  //   }
  // },
  // {
  //   title: '提货费',
  //   key: 'pickFee',
  //   minWidth: 120,
  //   render: (h, params) => {
  //     return h('span', params.row.pickFee ? (params.row.pickFee / 100).toFixed(2) : '-')
  //   }
  // },
  // {
  //   title: '装货费',
  //   key: 'loadFee',
  //   minWidth: 120,
  //   render: (h, params) => {
  //     return h('span', params.row.loadFee ? (params.row.loadFee / 100).toFixed(2) : '-')
  //   }
  // },
  // {
  //   title: '卸货费',
  //   key: 'unloadFee',
  //   minWidth: 120,
  //
  //   render: (h, params) => {
  //     return h('span', params.row.unloadFee ? (params.row.unloadFee / 100).toFixed(2) : '-')
  //   }
  // },
  // {
  //   title: '保险费',
  //   key: 'insureFee',
  //   minWidth: 120,
  //   render: (h, params) => {
  //     return h('span', params.row.insuranceFee ? (params.row.insuranceFee / 100).toFixed(2) : '-')
  //   }
  // },
  // {
  //   title: '其他费用',
  //   key: 'otherFee',
  //   minWidth: 120,
  //   render: (h, params) => {
  //     return h('span', params.row.otherFee ? (params.row.otherFee / 100).toFixed(2) : '-')
  //   }
  // },
  // {
  //   title: '总费用',
  //   key: 'totalFee',
  //   minWidth: 120,
  //   render: (h, params) => {
  //     return h('span', params.row.totalFee ? (params.row.totalFee / 100).toFixed(2) : '-')
  //   }
  // },
  // {
  //   title: '提货方式',
  //   key: 'pickTypeDesc',
  //   minWidth: 120,
  //   render: (h, p) => {
  //     return h('span', p.row.pickTypeDesc ? p.row.pickTypeDesc : '-')
  //   }
  // },
  // {
  //   title: '回单数量',
  //   key: 'receiptCount',
  //   minWidth: 120,
  //   render: (h, p) => {
  //     return h('span', p.row.receiptCount ? p.row.receiptCount : '-')
  //   }
  // },
  // {
  //   title: '代收货款',
  //   key: 'collectionMoney',
  //   minWidth: 120,
  //   render: (h, params) => {
  //     return h('span', params.row.collectionMoney ? (params.row.collectionMoney / 100).toFixed(2) : '-')
  //   }
  // },
  // {
  //   title: '是否开票',
  //   key: 'isInvoice',
  //   minWidth: 180,
  //   render: (h, params) => {
  //     return h('span', params.row.isInvoice === 1 ? '是' : '否')
  //   }
  // },
  // {
  //   title: '开票税率',
  //   key: 'invoiceRate',
  //   minWidth: 180,
  //   render: (h, params) => {
  //     return h('span', float.floor(params.row.invoiceRate * 100, 2) || '-')
  //   }
  // },
  // {
  //   title: '制单人',
  //   key: 'orderMakerName',
  //   minWidth: 120,
  //   render: (h, p) => {
  //     return h('span', p.row.orderMakerName ? p.row.orderMakerName : '-')
  //   }
  // }
]

// 油卡使用记录列表
export const usedTableColumns = vm => []
