/**
 * 自有车车辆信息和司机信息 模块
 * 包含所有自有车车辆信息和司机信息
 * @Author: mayousheng:Y010220
 * @Date: 2018-12-01 15:13:04
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-12-01 15:30:09
 */

import actions from './actions'
import * as getters from './getters'
import * as types from './mutationTypes.js'
// 承运商模块
const state = {
  cars: [], // 承运商车辆
  drivers: [] // 司机
}

const mutations = {
  [types.RECEIVE_OWN_CAR_LIST] (state, list) {
    state.cars = list
  },
  [types.RECEIVE_OWN_DRIVER_LIST] (state, list) {
    state.drivers = list
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
