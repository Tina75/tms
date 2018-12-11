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
  ownerCar: 'owner_car_head', // 报表 - 自有车
  CUSTOMER_PROFIT: 'customer_profit_head', // 客户利润
  CAR_PROFIT: 'car_profit_head', // 整车利润
  SINGLEVOTE_PROFIT: 'singleVote_profit_head', // 单票利润
  ownerDriver: 'owner_driver_head', // 报表 - 自有司机
  WAIT_PICKUP: 'wait_pickup_head', // 提货-待调度
  WAIT_WAYBILL: 'wait_waybill_head' // 送货管理-待调度
}
export default headType
