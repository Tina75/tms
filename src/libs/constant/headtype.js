/**
 * 自定义table-head枚举值
 */

const headType = {
  ORDER: 'order_head', // 订单
  RECEIPT: 'receipt_head', // 回单
  WAYBILL: 'waybill_head', // 运单
  PICKUP: 'pickup_head', // 提货单
  TRANS: 'trans_head', // 外转单
  BUSINESS: 'business_head', // 运营报表
  WAIT_PICKUP: 'wait_pickup_head', // 待提货
  WAIT_WAYBILL: 'wait_waybill_head' // 待送货
}
export default headType
