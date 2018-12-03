import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import login from '@/views/login/modules/store'
import transport from '@/views/transport/modules/store'
// import order from '@/views/order/create/modules/store'
import carrier from './modules/carrier/store'
import sender from './modules/sender/store'
import transfer from './modules/transfer/store'
import rule from './modules/rule/store'

Vue.use(Vuex)

const state = {
  userInfo: {}, // 用户信息
  permissions: [], // 权限列表
  tabNavList: [], // 已展示的tab列表
  messageCount: {}, // 消息通知数量
  customTableColumns: [], // 自定义table列表信息
  documentHeight: '' // documentBody高度
}

export default new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  state,
  actions,
  getters,
  mutations,
  modules: {
    login,
    transport,
    transfer,
    carrier,
    sender,
    rule
  }
})
