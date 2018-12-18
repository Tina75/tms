// 公司利润报表初始化
export const res = {
  orderFreightFee: '-',
  orderLoadFee: '-',
  orderUnloadFee: '-',
  orderOtherFee: '-',
  orderPickupFee: '-',
  orderInsuranceFee: '-',
  orderTotalFee: '-',
  carrierFreightFee: '-', // 承运商
  carrierLoadFee: '-',
  carrierUnloadFee: '-',
  carrierOtherFee: '-',
  carrierInsuranceFee: '-',
  carrierTotalFee: '-',
  myFuelFee: '-', // 自有车
  myTollFee: '-',
  myLoadFee: '-',
  myUnloadFee: '-',
  myInsuranceFee: '-',
  myOtherFee: '-',
  // transbillTransFee: '-',
  profits: '-',
  carrierTollFee: '-',
  orderCashBack: '-',
  orderInvoiceFee: '-',
  myAccommodation: '-'
}
export const TAB_LIST = [
  { name: '公司利润', count: '' },
  { name: '客户利润', count: '' },
  { name: '整车利润', count: '' },
  { name: '单票利润', count: '' }
]
export const URL = {
  2: '/report/customerProfit',
  3: '/report/whole/car',
  4: '/report/orderProfit'
}
export const TABLECOLUMNS = {
  2: [
    {
      title: '客户名称',
      key: 'consignerName',
      width: 200
    },
    {
      title: '订单数',
      key: 'orderNum',
      width: 200
    },
    {
      title: '重量（吨）',
      key: 'weight',
      width: 200
    },
    {
      title: '重量（公斤）',
      key: 'weightKg',
      width: 200
    },
    {
      title: '体积（方）',
      key: 'volume',
      width: 200
    },
    {
      title: '件数',
      key: 'quantity',
      width: 200
    },
    {
      title: '应收总费用',
      key: 'totalFee',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.totalFee / 100).toFixed(2))
      }
    },
    {
      title: '提货费合计',
      key: 'pickupBillFee',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.pickupBillFee / 100).toFixed(2))
      }
    },
    {
      title: '送货费合计',
      key: 'wayBillFee',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.wayBillFee / 100).toFixed(2))
      }
    },
    {
      title: '应付总费用',
      key: 'payableTotalFee',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.payableTotalFee / 100).toFixed(2))
      }
    },
    {
      title: '利润',
      key: 'profit',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.profit / 100).toFixed(2))
      }
    }
  ],
  3: [
    {
      title: '运单号',
      key: 'waybillNo',
      width: 150
    },
    {
      title: '车牌号',
      key: 'carNo',
      width: 150
    },
    {
      title: '里程数(公里)',
      key: 'mileage',
      width: 150,
      render: (h, params) => {
        return h('span', (params.row.mileage / 1000).toFixed(1))
      }
    },
    {
      title: '订单数',
      key: 'orderCnt',
      width: 150
    },
    {
      title: '重量（吨）',
      key: 'weight',
      width: 150
    },
    {
      title: '重量（公斤）',
      key: 'weightKg',
      width: 150
    },
    {
      title: '体积（方）',
      key: 'volume',
      width: 150
    },
    {
      title: '件数',
      key: 'cargoCnt',
      width: 150
    },
    {
      title: '应收总费用',
      key: 'orderFee',
      width: 150,
      render: (h, params) => {
        return h('span', (params.row.orderFee / 100).toFixed(2))
      }
    },
    {
      title: '提货费合计',
      key: 'loadbillFee',
      width: 150,
      render: (h, params) => {
        return h('span', (params.row.loadbillFee / 100).toFixed(2))
      }
    },
    {
      title: '送货费合计',
      key: 'waybillFee',
      width: 150,
      render: (h, params) => {
        return h('span', (params.row.waybillFee / 100).toFixed(2))
      }
    },
    {
      title: '应付总费用',
      key: 'payTotalFee',
      width: 150,
      render: (h, params) => {
        return h('span', (params.row.payTotalFee / 100).toFixed(2))
      }
    },
    {
      title: '利润',
      key: 'profits',
      width: 150,
      render: (h, params) => {
        return h('span', (params.row.profits / 100).toFixed(2))
      }
    },
    {
      title: '发车时间',
      key: 'shipmentTime',
      width: 150,
      render: (h, params) => {
        return h('span', params.row.shipmentTime ? new Date(params.row.shipmentTime).Format('yyyy-MM-dd hh:mm') : '-')
      }
    },
    {
      title: '发车时间',
      key: 'arriveTime',
      width: 150,
      render: (h, params) => {
        return h('span', params.row.arriveTime ? new Date(params.row.arriveTime).Format('yyyy-MM-dd hh:mm') : '-')
      }
    },
    {
      title: '发货城市',
      key: 'startName',
      width: 250
    },
    {
      title: '收货城市',
      key: 'endName',
      width: 250
    }
  ],
  4: [
    {
      title: '订单号',
      key: 'orderNo',
      width: 200
    },
    {
      title: '客户订单号',
      key: 'customerOrderNo',
      width: 200
    },
    {
      title: '客户名称',
      key: 'consignerName',
      width: 200
    },
    {
      title: '里程数（公里）',
      key: 'mileage',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.mileage / 1000).toFixed(1))
      }
    },
    {
      title: '重量（吨）',
      key: 'weight',
      width: 200
    },
    {
      title: '重量（公斤）',
      key: 'weightKg',
      width: 200
    },
    {
      title: '体积（方）',
      width: 200,
      key: 'volume'
    },
    {
      title: '件数',
      width: 200,
      key: 'quantity'
    },
    {
      title: '应收总费用',
      key: 'totalFee',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.totalFee / 100).toFixed(2))
      }
    },
    {
      title: '提货费合计',
      key: 'pickupBillFee',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.pickupBillFee / 100).toFixed(2))
      }
    },
    {
      title: '送货费合计',
      key: 'wayBillFee',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.wayBillFee / 100).toFixed(2))
      }
    },
    {
      title: '应付总费用',
      key: 'payableTotalFee',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.payableTotalFee / 100).toFixed(2))
      }
    },
    {
      title: '利润',
      key: 'profit',
      width: 200,
      render: (h, params) => {
        return h('span', (params.row.profit / 100).toFixed(2))
      }
    },
    {
      title: '创建时间',
      width: 200,
      key: 'createTime',
      render: (h, params) => {
        return h('span', params.row.createTime ? new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm') : '-')
      }
    },
    {
      title: '发货城市',
      key: 'startName',
      width: 300
    },
    {
      title: '收货城市',
      key: 'endName',
      width: 300
    }
  ]
}
export const EXPORT_URL = {
  1: '/report/for/profits/export',
  2: '/report/customerProfitExport',
  3: '/report/whole/car/export',
  4: '/report/orderProfitExport'
}
export const EXPORT_TITLE = {
  1: '利润报表（公司利润）',
  2: '利润报表（客户利润）',
  3: '利润报表（整车利润）',
  4: '利润报表（单票利润）'
}
