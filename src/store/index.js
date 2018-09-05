import Vue from 'vue'
import Vuex from 'vuex'
import * as mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

const state = {
  breadlist: [],
  tabNav: {
    tabList: [ {path: '/home', name: '首页'},
      {path: '/example/page1', name: 'page1'},
      {path: '/error-page/403', name: '403'},
      {path: '/error-page/404', name: '404'},
      {path: '/error-page/500', name: '500'}],
    currTab: {}
  }
}

export default new Vuex.Store({
  // strict: debug,
  state,
  actions,
  getters,
  mutations
})
