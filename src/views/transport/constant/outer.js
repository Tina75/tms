import TMSUrl from '@/libs/constant/url'
import IconLabel from '@/components/IconLabel'

export const TAB_LIST = [
  { name: '全部', count: '' },
  { name: '待发运', count: '' },
  { name: '在途', count: '' },
  { name: '已到货', count: '' }
]

export function setTabList (data) {
  return [
    { name: '全部', count: '' },
    { name: '待发运', count: data.statusCntInfo.waitCnt || 0 },
    { name: '在途', count: data.statusCntInfo.loadCnt || 0 },
    { name: '已到货', count: data.statusCntInfo.loadedCnt || 0 }
  ]
}

export const BUTTON_LIST = vm => [
  {
    tab: '全部',
    btns: [{
      name: '发运',
      code: 120301,
      func: () => {
        vm.billShipment()
      }
    }, {
      name: '到货',
      code: 120302,
      func: () => {
        vm.billArrived()
      }
    }, {
      name: '删除',
      code: 120304,
      func: () => {
        vm.billDelete()
      }
    }, {
      name: '导出',
      code: 120305,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '待发运',
    btns: [{
      name: '发运',
      code: 120301,
      func: () => {
        vm.billShipment()
      }
    }, {
      name: '删除',
      code: 120304,
      func: () => {
        vm.billDelete()
      }
    }, {
      name: '导出',
      code: 120305,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '在途',
    btns: [{
      name: '到货',
      code: 120302,
      func: () => {
        vm.billArrived()
      }
    }, {
      name: '查看车辆位置',
      // code: 120302,
      func: () => {
        vm.billLocation()
      }
    }, {
      name: '导出',
      code: 120305,
      func: () => {
        vm.billExport()
      }
    }]
  },
  {
    tab: '已到货',
    btns: [{
      name: '导出',
      code: 120305,
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
    title: '外转单号',
    key: 'transNo',
    width: 180,
    fixed: 'left',
    render: (h, p) => {
      let renderHtml = [
        h('a', {
          style: {
            color: '#418DF9',
            display: 'block'
          },
          on: {
            click: () => {
              vm.openTab({
                title: p.row.transNo,
                path: TMSUrl.OUTER_ORDER_DETAIL,
                query: { id: p.row.transId }
              })
            }
          }
        }, p.row.transNo)
      ]
      if (p.row.status >= 1 && p.row.abnormalLabel === 2) {
        renderHtml.push(
          h(IconLabel, {
            props: {
              text: '异',
              background: '#EE2018'
            }
          })
        )
      }
      if (p.row.cashBack > 0) {
        renderHtml.push(
          h(IconLabel, {
            props: {
              text: '返',
              background: '#00A4BD'
            }
          })
        )
      }
      if (p.row.collectionMoney > 0) {
        renderHtml.push(
          h(IconLabel, {
            props: {
              text: '代',
              background: '#FA8C15'
            }
          })
        )
      }
      return h('div', renderHtml)
    }
  },
  {
    title: '订单号',
    key: 'orderNo',
    width: 180
  },
  {
    title: '外转方运单号',
    key: 'outTransNo',
    width: 180
  },
  {
    title: '外转方名称',
    key: 'transfereeName',
    minWidth: 180,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.transfereeName, true)
    }
  },
  {
    title: '始发地',
    key: 'start',
    width: 180,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.startName)
    }
  },
  {
    title: '目的地',
    key: 'end',
    width: 180,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.endName)
    }
  },
  {
    title: '计费里程（公里）',
    key: 'mileage',
    width: 120,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.mileage === '' ? '' : p.row.mileage)
    }
  },
  {
    title: '外转运费',
    key: 'transFee',
    width: 120,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.transFee === '' ? '' : p.row.transFee / 100)
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
    title: '外转时间',
    key: 'createTimeLong',
    sortable: 'custom',
    width: 160,
    render: (h, p) => {
      return vm.tableDataRender(h, vm.timeFormatter(p.row.createTimeLong), true)
    }
  },
  {
    title: '客户订单号',
    key: 'customerOrderNo',
    width: 180
  },
  {
    title: '客户名称',
    key: 'consignerName',
    minWidth: 180,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.consignerName)
    }
  },
  {
    title: '发货人',
    key: 'consignerContact',
    width: 120
  },
  {
    title: '发货人手机号码',
    key: 'consignerPhone',
    width: 120
  },
  {
    title: '收货人',
    key: 'consigneeContact',
    width: 120
  },
  {
    title: '收货人手机号码',
    key: 'consigneePhone',
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
    key: 'payType',
    width: 120,
    render: (h, p) => {
      return vm.tableDataRender(h, vm.payTypeFormatter(p.row.payType, true))
    }
  },
  {
    title: '返现运费',
    key: 'cashBack',
    width: 120,
    render: (h, p) => {
      return vm.tableDataRender(h, p.row.cashBack === '' ? '' : p.row.cashBack / 100)
    }
  },
  {
    title: '要求装货时间',
    key: 'deliveryTimeLong',
    width: 160,
    render: (h, p) => {
      return vm.tableDataRender(h, vm.timeFormatter(p.row.deliveryTimeLong), true)
    }
  },
  {
    title: '期望到货时间',
    key: 'arriveTimeLong',
    width: 160,
    render: (h, p) => {
      return vm.tableDataRender(h, vm.timeFormatter(p.row.arriveTimeLong), true)
    }
  },
  {
    title: '回单数',
    key: 'receiptCount',
    width: 120
  },
  {
    title: '代收货款',
    key: 'collectionMoney',
    minWidth: 120,
    render: (h, params) => {
      return h('span', params.row.collectionMoney ? (params.row.collectionMoney / 100).toFixed(2) : '-')
    }
  },
  {
    title: '制单人',
    key: 'createOperator',
    width: 120
  }
]

// TMS1.1 18.10.22 已废弃
export const EXTRA_COLUMNS = [
  {
    title: '外转单号',
    key: 'transNo',
    fixed: true,
    visible: true
  },
  {
    title: '订单号',
    key: 'orderNo',
    fixed: false,
    visible: true
  },
  {
    title: '外转方运单号',
    key: 'outTransNo',
    fixed: false,
    visible: true
  },
  {
    title: '外转方名称',
    key: 'transfereeName',
    fixed: false,
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
    title: '外转运费',
    key: 'transFee',
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
    title: '外转时间',
    key: 'createTimeLong',
    fixed: false,
    visible: true
  },
  {
    title: '客户订单号',
    key: 'customerOrderNo',
    fixed: false,
    visible: false
  },
  {
    title: '客户名称',
    key: 'consignerName',
    fixed: false,
    visible: false
  },
  {
    title: '发货人',
    key: 'consignerContact',
    fixed: false,
    visible: false
  },
  {
    title: '发货人手机号码',
    key: 'consignerPhone',
    fixed: false,
    visible: false
  },
  {
    title: '收货人',
    key: 'consigneeContact',
    fixed: false,
    visible: false
  },
  {
    title: '收货人手机号码',
    key: 'consigneePhone',
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
    key: 'payType',
    fixed: false,
    visible: false
  },
  {
    title: '要求装货时间',
    key: 'deliveryTimeLong',
    fixed: false,
    visible: false
  },
  {
    title: '期望到货时间',
    key: 'arriveTimeLong',
    fixed: false,
    visible: false
  },
  {
    title: '回单数',
    key: 'receiptCount',
    fixed: false,
    visible: false
  },
  {
    title: '制单人',
    key: 'createOperator',
    fixed: false,
    visible: false
  }
]
