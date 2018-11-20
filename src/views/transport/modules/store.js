import * as types from './mutationTypes'
import * as getters from './getters'
import actions from './actions'

import { TAB_LIST as WAYBILL_TAB_LIST } from '../constant/waybill'
import { TAB_LIST as PICKUP_TAB_LIST } from '../constant/pickup'

const state = {
  waybillTabCount: WAYBILL_TAB_LIST,
  pickupTabCount: PICKUP_TAB_LIST
}

const mutations = {
  [types.WAYBILL_TAB_COUNT] (state, tabCount) {
    state.waybillTabCount = tabCount
  },
  [types.PICKUP_TAB_COUNT] (state, tabCount) {
    state.pickupTabCount = tabCount
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
