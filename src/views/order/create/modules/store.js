import * as types from './mutationTypes'
import actions from './actions'
import * as getters from './getters'
import Cargo from '../libs/cargo'
const defaultCargo = {
  cargoName: '', // 货物名称
  unit: '', // 包装
  cargoCost: '', // 货值
  weight: '', // 重量
  volume: '',
  remark: ''
}
const state = {
  order: {
    form: {},
    pagination: {
      pageNo: 1,
      pageSize: 10,
      total: 0
    },
    detail: {}, // 订单详情
    clients: [], // 客户信息
    consigners: [], // 发货方信息
    addresses: [], // 发货方地址
    consignees: [], // 收货方列表
    // 常用货物，数据不变
    cargoes: [],
    // 客户实际需要的货物，基于上面的cargoes
    consignerCargoes: [
      new Cargo(defaultCargo)
    ]
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
  [types.RECEIVE_CONSIGNER_CARGO_LIST] ({ order }, list) {
    order.consignerCargoes = list
  },
  [types.RECEIVE_ORDER_DETAIL] ({ order }, detail) {
    order.detail = detail
  },
  [types.APPEND_CONSIGNER_CARGO] ({ order }, index) {
    order.consignerCargoes.splice(index, -1, new Cargo(defaultCargo))
  },
  [types.REMOVE_CONSIGNER_CARGO] ({ order }, index) {
    order.consignerCargoes.splice(index, 1)
  },
  [types.UPDATE_CONSIGNER_CARGO] ({ order }, item) {
    order.consignerCargoes[item.index] = Object.assign({}, order.consignerCargoes[item.index], item.cargo)
  },
  [types.UPDATE_FULL_CONSIGNER_CARGO] ({ order }, item) {
    order.consignerCargoes.splice(item.index, 1, item.cargo)
  },
  [types.CLEAR_CONSIGNER_CARGO_LIST] ({ order }) {
    order.consignerCargoes = [new Cargo()]
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
