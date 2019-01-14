export default{
  initUserInfo (state, payload) {
    state.userInfo = payload || {}
  },
  initPermissions (state, payload) {
    state.permissions = payload || []
  },
  updateMsgCount (state, payload) {
    const msg = { ...payload }
    msg.all = msg.sysNum + msg.orderNum + msg.carrierNum
    state.messageCount = msg
  },
  initTableColumns (state, list) {
    state.customTableColumns = list
  },
  updateTableColumns (state, data) {
    data.list.forEach(e => {
      const headRow = state.customTableColumns[data.type].find(ph => ph.k === e.key)
      headRow.v = e.visible
      headRow.s = e.sort
    })
  },
  updateDocumentHeight (state, payload) {
    state.documentHeight = payload
  },
  /**
   * 开单设置配置
   * @param {*} state
   * @param {Number} option
   */
  changeOrderConfiguration (state, option) {
    for (let i in state.orderSet) {
      state.orderSet[i] = option[i]
    }
  },
  /**
   * 系统设置-派车设置
   * @param {*} state
   * @param {*} option
   */
  changeDispatchConfiguration (state, option) {
    for (let i in state.deliverySet) {
      state.dispatchSet[i] = option[i]
    }
  },
  /**
   * 保存短信配置
   * @param {*} state
   * @param {*} list
   */
  smsSetting (state, list) {
    state.smsSet = list
  },
  /**
   * 分摊策略
   * @param {*} state
   * @param {*} option
   */
  allocationStrategySetting (state, option) {
    state.allocationStrategy = option
  },
  /**
   * 常发货物
   * @param {*} state
   * @param {*} option
   */
  tmsCargoDtoSetting (state, option) {
    state.tmsCargoDto = option
  },
  /**
   * 上报异常货物修改临时存储货物信息(少货、货损)
   * @param {*} state
   * @param {*} cargo
   */
  setAbnormalCargoInfos (state, cargo) {
    for (let i in state.abnormalCargoInfos) {
      state.abnormalCargoInfos[i] = cargo[i] || []
    }
  },
  /**
   * 上报异常货物重置临时存储货物信息为空
   * @param {*} state
   */
  resetAbnormalCargoInfos (state) {
    for (let i in state.abnormalCargoInfos) {
      state.abnormalCargoInfos[i] = []
    }
  },
  /**
   * 上报异常货物修改临时存储货物信息(多货)
   * @param {*} state
   * @param {*} cargo
   * @param {*} order
   */
  setAbnormalAddCargoInfos (state, cargo) {
    state.abnormalAddCargoInfos.addCargoInfos.push(...cargo)
    // state.abnormalAddCargoInfos.addOrderData = order
  },
  /**
   * 上报异常货物覆盖临时存储货物信息(多货)
   * @param {*} state
   * @param {*} cargo
   * @param {*} order
   */
  resetAbnormalAddCargoInfos (state, cargo) {
    state.abnormalAddCargoInfos.addCargoInfos = cargo
    // state.abnormalAddCargoInfos.addOrderData = order
  },
  /**
   * 移除上报异常货物修改临时存储货物信息(多货)
   * @param {*} state
   * @param {*} index
   * @param {*} order
   */
  removeAbnormalAddCargoInfos (state, index) {
    state.abnormalAddCargoInfos.addCargoInfos.splice(index, 1)
    // state.abnormalAddCargoInfos.addOrderData = order
  },
  /**
   * 清空上报异常货物修改临时存储货物信息(多货)
   * @param {*} state
   */
  clearAbnormalAddCargoInfos (state) {
    state.abnormalAddCargoInfos.addCargoInfos = []
    // state.abnormalAddCargoInfos.addOrderData = []
  },
  /**
   * 设置当前导入订单批次号
   * @param {*} id
   */
  setImported (state, id) {
    state.importId = id
  }
}

// import store from '.'

// export const initMenuData = (state, data) => {
//   state.app.menuData = data
// }
// export const initUserInfo = (state, data) => {
//   state.userInfo = data
// }

// /**
//  *  更新tabNav列表
//  */
// export const setTabNavList = (state, list) => {
//   state.tabNavList = [...list]
//   localStorage.tabNavCache = JSON.stringify([...list])
// }
// export const initTabNav = (state) => {
//   state.tabNavList = localStorage.tabNavCache ? JSON.parse(localStorage.tabNavCache) : []
// }

// export const powerControl = (state, data) => {
//   state.powerControl = data
// }
