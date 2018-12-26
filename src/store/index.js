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
import driver from './modules/driver/store'
// import transfer from './modules/transfer/store'
import rule from './modules/rule/store'
import main from '@/views/main/store'
import upstream from './modules/upstream/store'

Vue.use(Vuex)

const state = {
  userInfo: {}, // 用户信息
  permissions: [], // 权限列表
  // tabNavList: [], // 已展示的tab列表
  messageCount: {}, // 消息通知数量
  customTableColumns: [], // 自定义table列表信息
  documentHeight: '', // documentBody高度
  order: {
    weightOption: 1 // 开单设置选项，1：吨；2：公斤
  },
  orderSet: {
    // 收货人单位
    consigneeCompanyNameOption: 2,
    // 货物编号
    cargoNoOption: 1,
    // 包装数量
    quantityOption: 1,
    // 重量吨
    weightTonOption: 1,
    // 重量公斤
    weightKgOption: 2,
    // 体积
    volumeOption: 1,
    // 货值
    cargoCostOption: 1,
    // 包装方式
    unitOption: 1,
    // 包装尺寸
    dimensionOption: 1,
    // 备注
    cargoRemark1Option: 1,
    cargoRemark2Option: 1,
    cargoRemark3Option: 2,
    cargoRemark4Option: 2,
    // 提货费
    pickupFeeOption: 1,
    // 装货费
    loadFeeOption: 1,
    // 卸货费
    unloadFeeOption: 1,
    // 保险费
    insuranceFeeOption: 1,
    // 其他费用
    otherFeeOption: 1
  }
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
    driver,
    // transfer,
    carrier,
    sender,
    rule,
    main,
    upstream
  }
})
