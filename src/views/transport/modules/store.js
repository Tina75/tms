import * as types from './mutationTypes'
import * as getters from './getters'
import actions from './actions'

import { TAB_LIST } from '../constant/waybill'

const state = {
  waybillTabCount: TAB_LIST
}

const mutations = {
  [types.WAYBILL_TAB_COUNT] (state, tabCount) {
    state.waybillTabCount = tabCount
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
