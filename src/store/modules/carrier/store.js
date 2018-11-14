/**
 * 承运商模块
 * 该数据包含所有的承运商列表，承运商的司机和车辆信息
 * @Author: mayousheng:Y010220
 * @Date: 2018-11-14 12:48:56
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-11-14 12:55:29
 */

import actions from './actions'
import * as getters from './getters'
import * as types from './mutationTypes'
// 承运商模块
const state = {
  carriers: [], // 承运商列表
  cars: [], // 承运商车辆
  drivers: [] // 司机
}

const mutations = {
  [types.RECEIVE_CARRIER_LIST] (state, list) {
    state.carriers = list
  },
  [types.RECEIVE_CARRIER_CAR_LIST] (state, list) {
    state.cars = list
  },
  [types.RECEIVE_CARRIER_DRIVER_LIST] (state, list) {
    state.drivers = list
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
