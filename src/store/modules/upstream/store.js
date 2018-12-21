/**
 * 计算规则模块
 * 该数据包含所有的计费规则列表
 * @Author: TIna
 * @Date: 2018-12-20 15:39:56
 * @Last Modified by: TIna
 * @Last Modified time: 2018-12-20 15:39:56
 */
import actions from './actions'
import * as getters from './getters'
import * as types from './mutationTypes'

// 上游来单待接收数量
const state = {
  waitAccept: ''
}

const mutations = {
  [types.WAITACCEPT] (state, list) {
    state.waitAccept = list
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
