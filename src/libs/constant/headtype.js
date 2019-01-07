/**
 * 自定义table-head枚举值
 */

const headType = {
  ORDER: 'order_head', // 订单
  ORDER_TEMP: 'order_template_head', // 常发订单
  RECEIPT: 'receipt_head', // 回单
  WAYBILL: 'waybill_head', // 运单
  PICKUP: 'pickup_head', // 提货单
  TRANS: 'trans_head', // 外转单
  BUSINESS: 'business_head', // 运营报表
  WAIT_PICKUP: 'wait_pickup_head', // 提货-待调度
  WAIT_WAYBILL: 'wait_waybill_head', // 送货管理-待调度
  TURNOVER: 'turnover_head', // 营业额汇总报表
  OWNER_DRIVER: 'owner_driver_head', // 自有司机表头
  OWNER_CAR: 'owner_car_head', // 自有车表头
  CUSTOMER_PROFIT: 'customer_profit_head', // 客户利润
  CAR_PROFIT: 'car_profit_head', // 整车利润
  SINGLEVOTE_PROFIT: 'singleVote_profit_head', // 单票利润
  UPSTREAM_ORDER: 'upstream_order_head', // 上游订单的自定义表头
  OIL_CARD_LOG: 'oil_card_log', // 油卡使用记录
  CONSIGNER_CARGO: 'consigner_cargo_head' // 常发货物

}
export default headType
