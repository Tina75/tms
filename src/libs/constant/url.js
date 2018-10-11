/**
 * 全局统一管理路由地址信息
 * @Author: mayousheng:Y010220
 * @Date: 2018-10-09 15:36:10
 * @Last Modified by:   Y010220
 * @Last Modified time: 2018-10-09 15:36:10
 */

const TMSUrl = {
  HOME: '/home', // 首页
  CREATE_ORDER: '/order/create', // 手工下单
  IMPORT_ORDER: '/order/import', // 批量导入
  ORDER_MANAGEMENT: '/order-management/order', // 订单管理
  ORDER_DETAIL: '/order-management/detail', // 订单详情
  RECEIPT_ORDER_MANAGEMENT: '/order-management/receipt', // 回单管理
  DISPATCH_PANEL: '/order-management/dispatch', // 调度工作台
  TANSPORT_ORDER: '/transport/waybill', // 运单管理
  TRANSPORT_ORDER_DETAIL: '/transport/detail/detailFreight', // 运单详情
  PICKUP_ORDER: '/transport/receiveOrder', // 提货管理
  PICKUP_ORDER_DETAIL: '/transport/detail/detailPickup', // 提货单详情
  OUTER_ORDER: '/transport/outerOrder', // 外转单管理
  OUTER_ORDER_DETAIL: '/transport/detail/detailOuter', // 外转单详情
  SENDER_FINANCE: '/finance/sender', // 发货方对账
  CARRIER_FINANCE: '/finance/carrier', // 承运商对账
  TRANSFER_FINANCE: '/finance/transfer', // 外转方对账
  RULES_FINANCE: '/finance/rules', // 计费规则
  OPERATE_REPORT: '/report/operate', // 运营报表
  TOTAL_REPORT: '/report/total', // 营业额汇总表
  PROFIT_REPORT: '/report/profit', // 利润报表,
  SENDER_MANAGEMENT: '/client/sender', // 发货方管理
  CARRIER_MANAGEMENT: '/client/carrier', // 承运商管理
  TRANSFER_MANAGEMENT: '/client/transfer', // 外转方管理
  STAFF_MANAGEMENT: '/company-manage/staff-manage', // 员工管理
  EMPLOYEE_MANAGEMENT: '/company-manage/employee-manage', // 角色管理
  SETTING: '/set-up/index', // 设置
  MESSAGE_CENTER: '/info/index', // 消息中心
  HELP: '/helper/index' // 帮助中心
}
export default TMSUrl
