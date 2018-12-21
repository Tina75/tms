/**
 * 全局统一管理路由地址信息
 * @Author: mayousheng:Y010220
 * @Date: 2018-10-09 15:36:10
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-11-23 11:00:18
 */

const TMSUrl = {
  HOME: '/home', // 首页
  CREATE_ORDER: '/order/create', // 手工开单
  IMPORT_ORDER: '/order/import', // 批量导入
  ORDER_MANAGEMENT: '/order/management/order', // 订单管理
  ORDER_DETAIL: '/order/management/detail', // 订单详情
  RECEIPT_ORDER_MANAGEMENT: '/transport/receipt', // 回单管理
  DISPATCH_PANEL: '/order/management/dispatch', // 调度工作台
  TANSPORT_ORDER: '/transport/waybill', // 送货管理
  TRANSPORT_ORDER_DETAIL: '/transport/detail/detailFreight', // 运单详情
  PICKUP_ORDER: '/transport/pickupOrder', // 提货管理
  PICKUP_ORDER_DETAIL: '/transport/detail/detailPickup', // 提货单详情
  OUTER_ORDER: '/transport/outerOrder', // 外转单管理
  OUTER_ORDER_DETAIL: '/transport/detail/detailOuter', // 外转单详情
  SENDER_FINANCE: '/finance/sender', // 发货方对账
  CARRIER_FINANCE: '/finance/carrier', // 承运商对账
  TRANSFER_FINANCE: '/finance/transfer', // 外转方对账
  COLLECT_FEE_FINANCE: '/finace/collectFee', // 代收货款
  RULES_FINANCE: '/finance/rules', // 计费规则
  OPERATE_REPORT: '/report/operate', // 运营报表
  TOTAL_REPORT: '/report/total', // 营业额汇总表
  PROFIT_REPORT: '/report/profit', // 利润报表,
  SENDER_MANAGEMENT: '/client/sender', // 发货方管理
  CARRIER_MANAGEMENT: '/client/carrier', // 承运商管理
  CARRIER_MANAGEMENT_CAEDETAILS: '/client/car-details', // 承运商管理车辆详情
  CARRIER_MANAGEMENT_REPAIRDETAILS: '/client/car-repair-details', // 承运商维修详情
  TRANSFER_MANAGEMENT: '/client/transfer', // 外转方管理
  OWNEDVEHICLE_DRIVER: '/owned-vehicle/driver', // 自有车-司机管理
  OWNEDVEHICLE_CAR: '/owned-vehicle/car', // 自有车-车辆管理
  OWNEDVEHICLE_REPAIR: '/owned-vehicle/repair', // 自有车-维修保养
  OWNEDVEHICLE_INSURANCE: '/owned-vehicle/insurance', // 自有车-保险
  OWNEDVEHICLE_CHECK: '/owned-vehicle/check', // 自有车-年检
  OWNEDVEHICLE_TYRE: '/owned-vehicle/tyre', // 自有车-轮胎
  OWNEDVEHICLE_DRIVERINFO: '/owned-vehicle/driver-details', // 自有车-司机详情
  OWNEDVEHICLE_CAEDETAILS: '/owned-vehicle/car-details', // 自有车-车辆详情
  OWNEDVEHICLE_REPAIRDETAILS: '/owned-vehicle/car-repair-details', // 自有车-维修详情
  STAFF_MANAGEMENT: '/company/staff-manage', // 员工管理
  EMPLOYEE_MANAGEMENT: '/company/role-manage', // 角色管理
  SETTING: '/set-up/index', // 设置
  COMPANY_SETTING: '/company/setting', // 公司设置
  MESSAGE_CENTER: '/information/index', // 消息中心
  MESSAGE_DETAIL: '/information/message-info', // 消息详情
  PROCESS: '/helper/process', // 业务流程
  HELP: '/helper/index' // 帮助中心
}
export default TMSUrl
