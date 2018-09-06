import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

const state = {
  breadlist: [],
  tabNav: {
    tabList: [{name: '首页', href: '/home'}],
    currTab: {name: '首页', href: '/home'}
  }
}

export default new Vuex.Store({
  // strict: debug,
  state,
  actions,
  getters,
  mutations
})
