import TMSUrl from '@/libs/constant/url'

export const TAB_LIST = [
  // { name: '全部', count: '' },
  { name: '待调度', count: '' },
  { name: '待派车', count: '' },
  { name: '待发运', count: '' },
  { name: '在途', count: '' },
  { name: '已到货', count: '' }
]

export function setTabList (data) {
  return [
    { name: '待调度', count: data.waitDispatchCnt || 0 },
    { name: '待派车', count: data.waitAssignCarCnt || 0 },
    { name: '待发运', count: data.waitSendCarCnt || 0 },
    { name: '在途', count: data.inTransportCnt || 0 },
    { name: '已到货', count: data.arrivedCnt || 0 }
  ]
}

export const BUTTON_LIST = vm => [
  // {
  //   tab: '全部',
  //   btns: [{
  //     name: '发运',
  //     code: 120102,
  //     func: () => {
  //       vm.billShipment()
  //     }
  //   }, {
  //     name: '打印',
  //     code: 120103,
  //     func: () => {
  //       vm.billPrint()
  //     }
  //   }, {
  //     name: '到货',
  //     code: 120104,
  //     func: () => {
  //       vm.billArrived()
  //     }
  //   }, {
  //     name: '删除',
  //     code: 120105,
  //     func: () => {
  //       vm.billDelete()
  //     }
  //   }, {
  //     name: '位置',
  //     code: 120106,
  //     func: () => {
  //       vm.billLocation()
  //     }
  //   }, {
  //     name: '导出',
  //     code: 120108,
  //     func: () => {
  //       vm.billExport()
  //     }
  //   }]
  // },
  { tab: '待调度', btns: [] },
  {
    tab: '待派车',
    btns: [{
      name: '删除',
      code: 120105,
      func: () => {
        vm.billDelete()
      }
    }, {
      name: '导出',
      code: 120108,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '待发运',
    btns: [{
      name: '发运',
      code: 120102,
      func: () => {
        vm.billShipment()
      }
    }, {
      name: '打印',
      code: 120103,
      func: () => {
        vm.billPrint()
      }
    }, {
      name: '导出',
      code: 120108,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '在途',
    btns: [{
      name: '到货',
      code: 120104,
      func: () => {
        vm.billArrived()
      }
    }, {
      name: '位置',
      code: 120106,
      func: () => {
        vm.billLocation()
      }
    }, {
      name: '导出',
      code: 120108,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '已到货',
    btns: [{
      name: '导出',
      code: 120108,
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
    title: '运单号',
    key: 'waybillNo',
    width: 180,
    fixed: 'left',
    render: (h, p) => {
      return h('a', {
        style: {
          color: '#418DF9'
        },
        on: {
          click: () => {
            vm.openTab({
              title: p.row.waybillNo,
              path: TMSUrl.TRANSPORT_ORDER_DETAIL,
              query: { id: p.row.waybillId }
            })
          }
        }
      }, p.row.waybillNo)
    }
  },
  {
    title: '始发地',
    key: 'start',
    minWidth: 180,
    ellipsis: true,
    render: (h, p) => {
      return vm.tableDataRender(h, vm.cityFormatter(p.row.start))
    }
  },
  {
    title: '目的地',
    key: 'end',
    minWidth: 180,
    ellipsis: true,
    render: (h, p) => {
      return vm.tableDataRender(h, vm.cityFormatter(p.row.end))
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
    title: '体积(方)',
    key: 'volume',
    width: 120
  },
  {
    title: '重量(吨)',
    key: 'weight',
    width: 120
  },
  {
    title: '创建时间',
    key: 'createTimeLong',
    minWidth: 160,
    sortable: 'custom',
    render: (h, p) => {
      return vm.tableDataRender(h, vm.timeFormatter(p.row.createTimeLong), true)
    }
  },
  {
    title: '制单人',
    key: 'createOperator',
    width: 120
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
    title: '司机',
    key: 'driverName',
    width: 120
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
  },
  {
    title: '回单数',
    key: 'backbillCnt',
    width: 120
  }
]

export const EXTRA_COLUMNS = [
  {
    title: '运单号',
    key: 'waybillNo',
    fixed: true,
    visible: true
  },
  {
    title: '始发地',
    key: 'start',
    fixed: false,
    visible: true
  },
  {
    title: '目的地',
    key: 'end',
    fixed: false,
    visible: true
  },
  {
    title: '承运商',
    key: 'carrierName',
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
    title: '司机',
    key: 'driverName',
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
  },
  {
    title: '回单数',
    key: 'backbillCnt',
    fixed: false,
    visible: false
  }
]
