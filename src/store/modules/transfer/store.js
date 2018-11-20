/**
 * 外转方列表
 * @Author: mayousheng:Y010220
 * @Date: 2018-11-14 12:53:58
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-11-14 12:57:49
 */
import actions from './actions'
import * as getters from './getters'
import * as types from './mutationTypes'
const state = {
  transferees: []
}

const mutations = {
  [types.RECEIVE_TRANSFEREE_LIST] (state, list) {
    state.transferees = list
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
