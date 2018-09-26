import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import order from '@/views/order/create/modules/store'
Vue.use(Vuex)

const state = {
  userInfo: {}, // 用户信息
  permissions: [], // 权限列表
  tabNavList: [], // 已展示的tab列表
  messageCount: {} // 消息通知数量
}

export default new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state,
  actions,
  getters,
  mutations,
  modules: {
    order
  }
})
