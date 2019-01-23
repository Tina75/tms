import { renderFee, getMileageText } from '@/libs/js/config'
// 公司利润报表初始化
export const res = {
  orderFreightFee: '0',
  orderLoadFee: '0',
  orderUnloadFee: '0',
  orderOtherFee: '0',
  orderPickupFee: '0',
  orderInsuranceFee: '0',
  orderTotalFee: '0',
  carrierFreightFee: '0', // 承运商
  carrierLoadFee: '0',
  carrierUnloadFee: '0',
  carrierOtherFee: '0',
  carrierInsuranceFee: '0',
  carrierTotalFee: '0',
  myFuelFee: '0', // 自有车
  myTollFee: '0',
  myLoadFee: '0',
  myUnloadFee: '0',
  myInsuranceFee: '0',
  myOtherFee: '0',
  // transbillTransFee: '0',
  profits: '0',
  carrierTollFee: '0',
  orderCashBack: '0',
  orderInvoiceFee: '0',
  infoFee: '0',
  myAccommodation: '0'
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
  // 客户利润
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
        // return h('span', (params.row.totalFee / 100).toFixed(2))
        return renderFee(h, params.row.totalFee)
      }
    },
    {
      title: '返现运费',
      key: 'cashBack',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.totalFee / 100).toFixed(2))
        return renderFee(h, params.row.cashBack)
      }
    },
    {
      title: '提货费合计',
      key: 'pickupBillFee',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.pickupBillFee / 100).toFixed(2))
        return renderFee(h, params.row.pickupBillFee)
      }
    },
    {
      title: '送货费合计',
      key: 'wayBillFee',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.wayBillFee / 100).toFixed(2))
        return renderFee(h, params.row.wayBillFee)
      }
    },
    {
      title: '应付总费用',
      key: 'payableTotalFee',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.payableTotalFee / 100).toFixed(2))
        return renderFee(h, params.row.payableTotalFee)
      }
    },
    {
      title: '开票税费',
      key: 'invoiceAmount',
      width: 200,
      render: (h, params) => {
        return renderFee(h, params.row.invoiceAmount)
      }
    },
    {
      title: '利润',
      key: 'profit',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.profit / 100).toFixed(2))
        return renderFee(h, params.row.profit)
      }
    }
  ],
  // 整车利润
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
        // return h('span', (params.row.mileage / 1000).toFixed(1))
        return h('span', getMileageText(params.row.mileage))
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
        return renderFee(h, params.row.orderFee)
      }
    },
    {
      title: '返现运费',
      key: 'cashBack',
      width: 150,
      render: (h, params) => {
        return renderFee(h, params.row.cashBack)
      }
    },
    {
      title: '提货费合计',
      key: 'loadbillFee',
      width: 150,
      render: (h, params) => {
        // return h('span', (params.row.loadbillFee / 100).toFixed(2))
        return renderFee(h, params.row.loadbillFee)
      }
    },
    {
      title: '送货费合计',
      key: 'waybillFee',
      width: 150,
      render: (h, params) => {
        return renderFee(h, params.row.waybillFee)
      }
    },
    {
      title: '应付总费用',
      key: 'payTotalFee',
      width: 150,
      render: (h, params) => {
        // return h('span', (params.row.payTotalFee / 100).toFixed(2))
        return renderFee(h, params.row.payTotalFee)
      }
    },
    {
      title: '开票税费',
      key: 'invoiceAmount',
      width: 150,
      render: (h, params) => {
        return renderFee(h, params.row.invoiceAmount)
      }
    },
    {
      title: '利润',
      key: 'profits',
      width: 150,
      render: (h, params) => {
        // return h('span', (params.row.profits / 100).toFixed(2))
        return renderFee(h, params.row.profits)
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
  // 单票利润
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
        // return h('span', (params.row.mileage / 1000).toFixed(1))
        return h('span', getMileageText(params.row.mileage))
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
        // return h('span', (params.row.totalFee / 100).toFixed(2))
        return renderFee(h, params.row.totalFee)
      }
    },
    {
      title: '返现运费',
      key: 'cashBack',
      width: 200,
      render: (h, params) => {
        return renderFee(h, params.row.cashBack)
      }
    },
    {
      title: '提货费合计',
      key: 'pickupBillFee',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.pickupBillFee / 100).toFixed(2))
        return renderFee(h, params.row.pickupBillFee)
      }
    },
    {
      title: '送货费合计',
      key: 'wayBillFee',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.wayBillFee / 100).toFixed(2))
        return renderFee(h, params.row.wayBillFee)
      }
    },
    {
      title: '应付总费用',
      key: 'payableTotalFee',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.payableTotalFee / 100).toFixed(2))
        return renderFee(h, params.row.payableTotalFee)
      }
    },
    {
      title: '开票税费',
      key: 'invoiceAmount',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.wayBillFee / 100).toFixed(2))
        return renderFee(h, params.row.invoiceAmount)
      }
    },
    {
      title: '利润',
      key: 'profit',
      width: 200,
      render: (h, params) => {
        // return h('span', (params.row.profit / 100).toFixed(2))
        return renderFee(h, params.row.profit)
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
