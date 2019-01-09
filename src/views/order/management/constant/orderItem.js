const ORDER_ITEM = [
  {
    name: '结算方式',
    value: 'settlementType',
    type: 'settle'
  },
  {
    name: '计费里程',
    value: 'mileage',
    type: 'mile'
  },
  {
    name: '运输费用',
    value: 'freightFee',
    type: 'moneny'
  },
  {
    name: '提货费用',
    value: 'pickupFee',
    type: 'moneny'
  },
  {
    name: '装货费用',
    value: 'loadFee',
    type: 'moneny'
  },
  {
    name: '卸货费用',
    value: 'unloadFee',
    type: 'moneny'
  },
  {
    name: '保险费用',
    value: 'insuranceFee',
    type: 'moneny'
  },
  {
    name: '其他费用',
    value: 'otherFee',
    type: 'moneny'
  },
  {
    name: '回单数量',
    value: 'receiptCount'
  },
  {
    name: '是否开票',
    value: 'isInvoice',
    type: 'boolean'
  },
  {
    name: '开票税率',
    value: 'invoiceRate',
    type: 'rate'
  },
  {
    name: '备注',
    value: 'remark'
  },
  {
    name: '代收货款',
    value: 'collectionMoney',
    type: 'moneny'
  }
]
export default ORDER_ITEM
