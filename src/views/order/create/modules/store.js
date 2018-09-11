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
    clients: [], // 客户信息
    consigners: [], // 发货方信息
    addresses: [], // 发货方地址
    consignees: [], // 收货方列表
    // 常用货物
    cargoes: [
      new Cargo(defaultCargo)
    ]
  }
}

const mutations = {
  [types.RECEIVE_CLIENT_LIST] ({order}, list) {
    order.clients = list
  },
  [types.RECEIVE_CONSIGNERS_LIST] ({order}, list) {
    order.consigners = list
  },
  [types.RECEIVE_ADDRESS_LIST] ({order}, list) {
    order.addresses = list
  },
  [types.RECEIVE_CONSIGNEES_LIST] ({order}, list) {
    order.consignees = list
  },
  [types.RECEIVE_CARGO_LIST] ({order}, list) {
    order.cargoes = list
  },
  [types.APPEND_CARGO] ({order}, index) {
    order.cargoes.splice(index, -1, new Cargo(defaultCargo))
  },
  [types.REMOVE_CARGO] ({order}, index) {
    order.cargoes.splice(index, 1)
  },
  [types.UPDATE_CARGO] ({order}, item) {
    order.cargoes[item.index] = Object.assign({}, order.cargoes[item.index], item.cargo)
  },
  [types.CLEAR_CARGO_LIST] ({order}) {
    order.cargoes = [new Cargo()]
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
