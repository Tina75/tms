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

/**
 * 默认派车设置
 */
export const defaultDispatchState = {
  // 自送
  selfSendOption: 2,
  // 外转
  outSendOption: 1,
  // 提货油费    自送
  pickSelfOilFeeOption: 1,
  // 提货装卸费 自送
  pickSelfLoadFeeOption: 1,
  // 提货卸货费 自送
  pickSelfUnloadFeeOption: 1,
  // 提货保险费 自送
  pickSelfInsuranceFeeOption: 1,
  // 提货其他 自送
  pickSelfOtherFeeOption: 1,
  // 提货运输费  外转
  pickOutFreightFeeOption: 1,
  // 提货装卸费 外转
  pickOutLoadFeeOption: 1,
  // 提货卸货费 外转
  pickOutUnloadFeeOption: 1,
  // 提货保险费 外转
  pickOutInsuranceFeeOption: 1,
  // 提货其他 外转
  pickOutOtherFeeOption: 1,
  // 送货油费  自送
  deliverSelfOilFeeOption: 1,
  // 送货装卸费 自送
  deliverSelfLoadFeeOption: 1,
  // 送货卸货费 自送
  deliverSelfUnloadFeeOption: 1,
  // 送货路桥费 自送
  deliverSelfTollFeeOption: 1,
  // 送货住宿费 自送
  deliverSelfAccommodationFeeOption: 1,
  // 送货保险费 自送
  deliverSelfInsuranceFeeOption: 1,
  // 送货其他 自送
  deliverSelfOtherFeeOption: 1,
  // 送货油费  外转
  deliverOutFreightFeeOption: 1,
  // 送货装卸费 外转
  deliverOutLoadFeeOption: 1,
  // 送货卸货费 外转
  deliverOutUnloadFeeOption: 1,
  // 送货路桥费 外转
  deliverOutTollFeeOption: 1,
  // 送货保险费 外转
  deliverOutInsuranceFeeOption: 1,
  // 送货其他 外转
  deliverOutOtherFeeOption: 1,
  // 送货信息费 外转
  deliverOutInfoFeeOption: 2,
  // 送货返现费 外转
  deliverOutCashBackFeeOption: 2,
  // 预付
  paySettlementAdvanceOption: 1,
  // 到付
  paySettlementArriveOption: 1,
  // 回付
  paySettlementReceiptOption: 1,
  // 尾款
  paySettlementTailOption: 2
}

const state = {
  userInfo: {}, // 用户信息
  permissions: [], // 权限列表
  // tabNavList: [], // 已展示的tab列表
  messageCount: {}, // 消息通知数量
  customTableColumns: [], // 自定义table列表信息
  documentHeight: '', // documentBody高度
  smsSet: [], // 短信设置,
  allocationStrategy: { // 分摊策略,1按订单数分摊,2按件数分摊,3按重量分摊,4按体积分摊
    orderStrategy: 2,
    waybillStrategy: 2
  },
  orderSet: {
    // 客户订单号
    customerOrderNoOption: 1,
    // 客户运单号
    customerWaybillNoOption: 1,
    // 对接业务员
    salesmanIdOption: 1,
    // 发货城市
    startCityOption: 1,
    // 到货城市
    endCityOption: 1,
    // 发货时间
    deliveryTimeOption: 1,
    // 到货时间
    arriveTimeOption: 1,
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
    remark1Option: 1,
    remark2Option: 1,
    // 计费里程
    mileageOption: 1,
    // 运输费
    freightFeeOption: 1,
    // 提货费
    pickupFeeOption: 1,
    // 装货费
    loadFeeOption: 1,
    // 卸货费
    unloadFeeOption: 1,
    // 保险费
    insuranceFeeOption: 1,
    // 其他费用
    otherFeeOption: 1,
    // 提货方式
    pickupOption: 1,
    // 回单数量
    receiptCountOption: 1,
    // 是否开票
    isInvoiceOption: 1,
    // 代收货款
    collectionMoneyOption: 1,
    // 订单备注
    orderRemarkOption: 1
  },
  // 派车设置
  dispatchSet: {
    ...defaultDispatchState
  },
  tmsCargoDto: {}, // 常发货物
  // 异常货物上报少货、货损临时存储
  abnormalCargoInfos: {
    parentOrderCargoList: [],
    parentOrderData: [],
    childOrderCargoList: [],
    childOrderData: [],
    originData: [] // 原始数据
  },
  // 异常货物上报多货临时存储
  abnormalAddCargoInfos: {
    addOrderData: [],
    addCargoInfos: []
  },
  // 导入订单批次号
  importId: null,
  // 公司信息
  companyInfo: {},
  // 订单全局搜索
  orderGlobal: '',
  isOrderGlobal: false
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
