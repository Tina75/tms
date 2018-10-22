import * as types from './mutationTypes'
import actions from './actions'
import * as getters from './getters'
const state = {
  order: {
    detail: {}, // 订单详情
    clients: [], // 客户信息
    consigners: [], // 发货方信息
    addresses: [], // 发货方地址
    consignees: [], // 收货方列表
    // 常用货物，数据不变
    cargoes: [],
    carriers: [], // 承运商信息
    carrierCars: [], // 承运商车辆信息
    carrierDrivers: [], // 承运商司机信息
    transferees: [] // 外转方信息
  }
}

const mutations = {
  [types.RECEIVE_CLIENT_LIST] ({ order }, list) {
    order.clients = list
  },
  [types.RECEIVE_CONSIGNERS_LIST] ({ order }, list) {
    order.consigners = list
  },
  [types.RECEIVE_ADDRESS_LIST] ({ order }, list) {
    order.addresses = list
  },
  [types.RECEIVE_CONSIGNEES_LIST] ({ order }, list) {
    order.consignees = list
  },
  [types.RECEIVE_CARGO_LIST] ({ order }, list) {
    order.cargoes = list
  },
  [types.RECEIVE_ORDER_DETAIL] ({ order }, detail) {
    order.detail = detail
  },
  [types.RECEIVE_CARRIER_LIST] ({ order }, list) {
    order.carriers = list
  },
  [types.RECEIVE_CARRIER_CAR_LIST] ({ order }, list) {
    order.carrierCars = list
  },
  [types.RECEIVE_CARRIER_DRIVER_LIST] ({ order }, list) {
    order.carrierDrivers = list
  },
  [types.RECEIVE_TRANSFEREE_LIST] ({ order }, list) {
    order.transferees = list
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
