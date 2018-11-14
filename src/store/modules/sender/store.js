/**
 *
 * 发货方/客户模块
 * 该数据包含所有的发货方列表，发货方的联系人，发货方地址和常发货物，以及对应的收货人的名称、手机和收货地址
 * 接口查询的是不分页列表
 * 涉及页面：受理开单页，运单页等
 * @Author: mayousheng:Y010220
 * @Date: 2018-11-14 11:09:11
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-11-14 12:53:13
 */
import actions from './actions'
import * as getters from './getters'
import * as types from './mutationTypes'
const state = {
  senders: [], // 客户信息
  contacts: [], // 发货方信息，只包含手机号和联系人名称
  addresses: [], // 发货方地址
  consignees: [], // 收货方列表，包含收货人名称，手机号和收货地址
  cargoes: [] // 常用货物，数据不变
}

const mutations = {
  [types.RECEIVE_CLIENT_LIST] (state, list) {
    state.senders = list
  },
  [types.RECEIVE_CONTACT_LIST] (state, list) {
    state.contacts = list
  },
  [types.RECEIVE_ADDRESS_LIST] (state, list) {
    state.addresses = list
  },
  [types.RECEIVE_CONSIGNEES_LIST] (state, list) {
    state.consignees = list
  },
  [types.RECEIVE_CARGO_LIST] (state, list) {
    state.cargoes = list
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
