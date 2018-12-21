/**
 * 计算规则模块
 * 该数据包含所有的计费规则列表
 * @Author: TIna
 * @Date: 2018-12-03 09:44:56
 * @Last Modified by: TIna
 * @Last Modified time: 2018-12-03 09:44:56
 */
import actions from './actions'
import * as getters from './getters'
import * as types from './mutationTypes'

// 计费规则包括承运商和发货方
const state = {
  carriesRule: [], // 承运商
  senderRule: [], // 发货方
  ruleTypeList: '' // 计费规则类型
}

const mutations = {
  [types.CARRIES_RULE_LIST] (state, list) {
    state.carriesRule = list
  },
  [types.SENDER_RULE_LIST] (state, list) {
    state.senderRule = list
  },
  [types.RULE_TYPE_LIST] (state, list) {
    state.ruleTypeList = list
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
