// import TMSUrl from '@/libs/constant/url'
import float from '@/libs/js/float'
export const TABLE_COLUMNS = vm => [
  {
    type: 'selection',
    width: 50,
    align: 'center'
  },
  {
    title: '订单号',
    key: 'orderNo'
    // render: (h, p) => {
    //   return h('a', {
    //     style: {
    //       color: '#418DF9'
    //     },
    //     on: {
    //       click: () => {
    //         vm.openTab({
    //           title: p.row.billNo,
    //           path: p.row.billType === 1 ? TMSUrl.PICKUP_ORDER_DETAIL : TMSUrl.TRANSPORT_ORDER_DETAIL,
    //           query: {
    //             id: p.row.billId,
    //             abnormal: 1
    //           }
    //         })
    //       }
    //     }
    //   }, p.row.billNo)
    // }
  },
  {
    title: '客户单号',
    key: 'customerOrderNo',
    minWidth: 160,
    render: (h, p) => {
      return h('span', p.row.customerOrderNo ? p.row.customerOrderNo : '-')
    }
  },
  {
    title: '订单状态',
    key: 'status',
    minWidth: 120,
    render: (h, p) => {
      return h('span', vm.statusToName(p.row.status))
    }
  },
  {
    title: '客户名称',
    key: 'shipperCompanyName',
    minWidth: 180,
    tooltip: true
  },
  {
    title: '对接业务员',
    key: 'salesmanId',
    minWidth: 180,
    render: (h, params) => {
      return h('span', params.row.handlerUserName || '-')
    }
  },
  {
    title: '发货城市',
    key: 'departureCityName',
    minWidth: 180,
    ellipsis: true
  },
  {
    title: '收货城市',
    key: 'destinationCityName',
    minWidth: 180,
    ellipsis: true
  },
  {
    title: '计费里程（公里）',
    key: 'mileage',
    width: 120,
    render: (h, params) => {
      return h('span', params.row.mileage / 1000 || '-')
    }
  },
  {
    title: '体积（方）',
    key: 'volume',
    minWidth: 100,
    render: (h, p) => {
      return h('span', p.row.volume ? p.row.volume : '-')
    }
  },
  {
    title: '重量（吨）',
    key: 'weight',
    minWidth: 100,
    render: (h, p) => {
      return h('span', p.row.weight ? p.row.weight : '-')
    }
  },
  {
    title: '下单时间',
    key: 'createTime',
    minWidth: 150,
    render: (h, p) => {
      return h('span', p.row.createTime ? p.row.createTime : '-')
    }
    // render: (h, params) => {
    //   return h('span', params.row.createTime ? new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
    // }
  },
  {
    title: '发货时间',
    key: 'deliveryTime',
    minWidth: 150,
    render: (h, p) => {
      return h('span', p.row.deliveryTime ? p.row.deliveryTime : '-')
    }
    // render: (h, params) => {
    //   return h('span', params.row.deliveryTime ? new Date(params.row.deliveryTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
    // }
  },
  {
    title: '到货时间',
    key: 'arriveTime',
    minWidth: 150,
    render: (h, p) => {
      return h('span', p.row.arriveTime ? p.row.arriveTime : '-')
    }
    // render: (h, params) => {
    //   return h('span', params.row.arriveTime ? new Date(params.row.arriveTime).Format('yyyy-MM-dd hh:mm:ss') : '-')
    // }
  },
  {
    title: '发货人',
    key: 'consignerContact',
    minWidth: 120,
    tooltip: true,
    render: (h, p) => {
      return h('span', p.row.consignerContact ? p.row.consignerContact : '-')
    }
  },
  {
    title: '发货人手机号',
    key: 'consignerPhone',
    minWidth: 130,
    tooltip: true,
    render: (h, p) => {
      return h('span', p.row.consignerPhone ? p.row.consignerPhone : '-')
    }
  },
  {
    title: '发货地址',
    key: 'consignerAddress',
    minWidth: 180,
    tooltip: true,
    render: (h, p) => {
      return h('span', p.row.consignerAddress ? p.row.consignerAddress : '-')
    }
  },
  {
    title: '收货人',
    key: 'consigneeContact',
    minWidth: 120,
    tooltip: true,
    render: (h, p) => {
      return h('span', p.row.consigneeContact ? p.row.consigneeContact : '-')
    }
  },
  {
    title: '收货人手机号',
    key: 'consigneePhone',
    minWidth: 130,
    tooltip: true,
    render: (h, p) => {
      return h('span', p.row.consigneePhone ? p.row.consigneePhone : '-')
    }
  },
  {
    title: '收货地址',
    key: 'consigneeAddress',
    minWidth: 180,
    tooltip: true,
    render: (h, p) => {
      return h('span', p.row.consigneeAddress ? p.row.consigneeAddress : '-')
    }
  },
  {
    title: '结算方式',
    key: 'settlementTypeDesc',
    minWidth: 120,
    render: (h, p) => {
      return h('span', p.row.settlementTypeDesc ? p.row.settlementTypeDesc : '-')
    }
  },
  {
    title: '运输费',
    key: 'freightFee',
    minWidth: 120,
    render: (h, params) => {
      return h('span', params.row.freightFee ? (params.row.freightFee / 100).toFixed(2) : '-')
    }
  },
  {
    title: '提货费',
    key: 'pickupFee',
    minWidth: 120,
    render: (h, params) => {
      return h('span', params.row.pickupFee ? (params.row.pickupFee / 100).toFixed(2) : '-')
    }
  },
  {
    title: '装货费',
    key: 'loadFee',
    minWidth: 120,
    render: (h, params) => {
      return h('span', params.row.loadFee ? (params.row.loadFee / 100).toFixed(2) : '-')
    }
  },
  {
    title: '卸货费',
    key: 'unloadFee',
    minWidth: 120,

    render: (h, params) => {
      return h('span', params.row.unloadFee ? (params.row.unloadFee / 100).toFixed(2) : '-')
    }
  },
  {
    title: '保险费',
    key: 'insureFee',
    minWidth: 120,
    render: (h, params) => {
      return h('span', params.row.insuranceFee ? (params.row.insuranceFee / 100).toFixed(2) : '-')
    }
  },
  {
    title: '其他',
    key: 'otherFee',
    minWidth: 120,
    render: (h, params) => {
      return h('span', params.row.otherFee ? (params.row.otherFee / 100).toFixed(2) : '-')
    }
  },
  {
    title: '总费用',
    key: 'totalFee',
    minWidth: 120,
    render: (h, params) => {
      return h('span', params.row.totalFee ? (params.row.totalFee / 100).toFixed(2) : '-')
    }
  },
  {
    title: '提货方式',
    key: 'pickTypeDesc',
    minWidth: 120,
    render: (h, p) => {
      return h('span', p.row.pickTypeDesc ? p.row.pickTypeDesc : '-')
    }
  },
  {
    title: '回单数量',
    key: 'receiptCount',
    minWidth: 120,
    render: (h, p) => {
      return h('span', p.row.receiptCount ? p.row.receiptCount : '-')
    }
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
    title: '是否开票',
    key: 'isInvoice',
    minWidth: 180,
    render: (h, params) => {
      return h('span', params.row.isInvoice === 1 ? '是' : '否')
    }
  },
  {
    title: '开票税率',
    key: 'invoiceRate',
    minWidth: 180,
    render: (h, params) => {
      return h('span', float.floor(params.row.invoiceRate * 100, 2) || '-')
    }
  },
  {
    title: '制单人',
    key: 'orderMakerName',
    minWidth: 120,
    render: (h, p) => {
      return h('span', p.row.creatorName ? p.row.creatorName : '-')
    }
  }
]
export const TABLIST = [
  { name: '全部', count: '' },
  { name: '待接收', count: '' },
  { name: '已接收', count: '' },
  { name: '拒绝', count: '' }
]
export function setTabList (data) {
  return [
    { name: '全部', count: '' },
    { name: '待接收', count: data.waitAccept || 0 },
    { name: '已拒绝', count: data.accepted || 0 },
    { name: '拒绝', count: data.rejected || 0 }
  ]
}
export const BTNLIST = vm => [
  {
    tab: '全部',
    btns: [
      {
        name: '导出',
        code: 0,
        func: () => {
          vm.upstreamExport()
        }
      }
    ]
  },
  {
    tab: '待接收',
    btns: [{
      name: '接收',
      code: 0,
      func: () => {
        vm.accept()
      }
    }, {
      name: '拒绝',
      code: 0,
      func: () => {
        vm.reject()
      }
    }, {
      name: '导出',
      code: 0,
      func: () => {
        vm.upstreamExport()
      }
    }]
  },
  {
    tab: '已接收',
    btns: [
      {
        name: '导出',
        code: 0,
        func: () => {
          vm.upstreamExport()
        }
      }
    ]
  },
  {
    tab: '拒绝',
    btns: [
      {
        name: '导出',
        code: 0,
        func: () => {
          vm.upstreamExport()
        }
      }
    ]
  }
]
