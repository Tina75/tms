import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

const state = {
  breadlist: [],
  tabNavList: [{ name: '首页', path: '/home/index' }],
  // tabNav: {
  //   tabList: [{ name: '首页', path: '/home/index' }],
  //   currTab: { name: '首页', path: '/home/index' }
  // },
  userInfo: {}
}

export default new Vuex.Store({
  // strict: debug,
  state,
  actions,
  getters,
  mutations
})
