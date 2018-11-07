import TMSUrl from '@/libs/constant/url'

export const TAB_LIST = [
  // { name: '全部', count: '' },
  { name: '待调度', count: '' },
  { name: '待提货', count: '' },
  { name: '提货中', count: '' },
  { name: '已提货', count: '' }
]

export function setTabList (data) {
  return [
    { name: '待调度', count: data.waitDispatchCnt || 0 },
    { name: '待提货', count: data.waitCnt || 0 },
    { name: '提货中', count: data.loadCnt || 0 },
    { name: '已提货', count: data.loadedCnt || 0 }
  ]
}

export const BUTTON_LIST = vm => [
  // {
  //   tab: '全部',
  //   btns: [{
  //     name: '到货',
  //     code: 120203,
  //     func: () => {
  //       vm.billArrived()
  //     }
  //   }, {
  //     name: '打印',
  //     code: 120202,
  //     func: () => {
  //       vm.billPrint()
  //     }
  //   }, {
  //     name: '删除',
  //     code: 120204,
  //     func: () => {
  //       vm.billDelete()
  //     }
  //   }, {
  //     name: '查看车辆位置',
  //     code: 120205,
  //     func: () => {
  //       vm.billLocation()
  //     }
  //   }, {
  //     name: '导出',
  //     code: 120207,
  //     func: () => {
  //       vm.billExport()
  //     }
  //   }]
  // },
  { tab: '待调度', btns: [] },
  {
    tab: '待提货',
    btns: [{
      name: '打印',
      code: 120202,
      func: () => {
        vm.billPrint()
      }
    }, {
      name: '删除',
      code: 120202,
      func: () => {
        vm.billDelete()
      }
    }, {
      name: '导出',
      code: 120207,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '提货中',
    btns: [{
      name: '到货',
      code: 120203,
      func: () => {
        vm.billArrived()
      }
    }, {
      name: '打印',
      code: 120202,
      func: () => {
        vm.billPrint()
      }
    }, {
      name: '查看车辆位置',
      code: 120205,
      func: () => {
        vm.billLocation()
      }
    }, {
      name: '导出',
      code: 120207,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '已提货',
    btns: [{
      name: '导出',
      code: 120207,
      func: () => {
        vm.billExport()
      }
    }]
  }
]

export const TABLE_COLUMNS = vm => [
  {
    type: 'selection',
    width: 50,
    align: 'center',
    fixed: 'left'
  },
  {
    title: '提货单号',
    key: 'pickupNo',
    width: 180,
    fixed: 'left',
    render: (h, p) => {
      if (p.row.status > 1 && p.row.abnormalLabel === 2) {
        return h('div', [
          h('a', {
            style: {
              color: '#418DF9'
            },
            on: {
              click: () => {
                vm.openTab({
                  title: p.row.pickupNo,
                  path: TMSUrl.PICKUP_ORDER_DETAIL,
                  query: { id: p.row.pickUpId }
                })
              }
            }
          }, p.row.pickupNo),
          h('span', {
            style: {
              display: 'block',
              width: '14px',
              height: '14px',
              background: '#EE2018',
              borderRadius: '2px',
              color: '#fff',
              lineHeight: '14px',
              textAlign: 'center',
              marginRight: '5px',
              fontSize: '11px'
            }
          }, '异')
        ])
      } else {
        return h('a', {
          style: {
            color: '#418DF9'
          },
          on: {
            click: () => {
              vm.openTab({
                title: p.row.pickupNo,
                path: TMSUrl.PICKUP_ORDER_DETAIL,
                query: { id: p.row.pickUpId }
              })
            }
          }
        }, p.row.pickupNo)
      }
    }
  },
  {
    title: '承运商',
    key: 'carrierName',
    minWidth: 180,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.carrierName)
    }
  },
  {
    title: '司机',
    key: 'driverName',
    width: 120
  },
  {
    title: '车牌号',
    key: 'carNo',
    width: 120
  },
  {
    title: '合计运费',
    key: 'totalFee',
    width: 120,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.totalFee === '' ? '' : p.row.totalFee / 100)
    }
  },
  {
    title: '体积（方）',
    key: 'volume',
    width: 120
  },
  {
    title: '重量（吨）',
    key: 'weight',
    width: 120
  },
  {
    title: '创建时间',
    key: 'createTimeLong',
    sortable: 'custom',
    minWidth: 160,
    render: (h, p) => {
      return vm.tableDataRender(h, vm.timeFormatter(p.row.createTimeLong), true)
    }
  },
  {
    title: '制单人',
    key: 'createOperator',
    width: 120,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.createOperator)
    }
  },
  {
    title: '货值',
    key: 'cargoCost',
    width: 120,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.cargoCost === '' ? '' : p.row.cargoCost / 100)
    }
  },
  {
    title: '结算方式',
    key: 'settlementType',
    width: 120,
    render: (h, p) => {
      return vm.tableDataRender(h, vm.payTypeFormatter(p.row.settlementType))
    }
  },
  {
    title: '司机手机号码',
    key: 'driverPhone',
    width: 120
  },
  {
    title: '车型',
    key: 'carType',
    width: 120,
    render: (h, p) => {
      const carType = vm.carTypeFormatter(p.row.carType)
      const carLength = vm.carLengthFormatter(p.row.carLength)
      return vm.tableDataRender(h, carType || carLength ? [carType, carLength].join(' ') : '')
    }
  },
  {
    title: '订单数',
    key: 'orderCnt',
    width: 120
  }
]

// TMS1.1 18.10.22 已废弃
export const EXTRA_COLUMNS = [
  {
    title: '提货单号',
    key: 'pickupNo',
    fixed: true,
    visible: true
  },
  {
    title: '承运商',
    key: 'carrierName',
    fixed: false,
    visible: true
  },
  {
    title: '司机',
    key: 'driverName',
    fixed: false,
    visible: true
  },
  {
    title: '车牌号',
    key: 'carNo',
    fixed: false,
    visible: true
  },
  {
    title: '合计运费',
    key: 'totalFee',
    fixed: false,
    visible: true
  },
  {
    title: '体积（方）',
    key: 'volume',
    fixed: false,
    visible: true
  },
  {
    title: '重量（吨）',
    key: 'weight',
    fixed: false,
    visible: true
  },
  {
    title: '创建时间',
    key: 'createTimeLong',
    fixed: false,
    visible: true
  },
  {
    title: '制单人',
    key: 'createOperator',
    fixed: false,
    visible: false
  },
  {
    title: '货值',
    key: 'cargoCost',
    fixed: false,
    visible: false
  },
  {
    title: '结算方式',
    key: 'settlementType',
    fixed: false,
    visible: false
  },
  {
    title: '司机手机号码',
    key: 'driverPhone',
    fixed: false,
    visible: false
  },
  {
    title: '车型',
    key: 'carType',
    fixed: false,
    visible: false
  },
  {
    title: '订单数',
    key: 'orderCnt',
    fixed: false,
    visible: false
  }
]
