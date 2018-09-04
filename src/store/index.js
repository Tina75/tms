import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './mutationTypes'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

const state = {
  breadlist: []
}

const mutations = {
  [types.BREADCRUMD] (state, payload) {
    state.breadlist = payload
  }
}

export default new Vuex.Store({
  // strict: debug,
  state,
  actions,
  getters,
  mutations
})
