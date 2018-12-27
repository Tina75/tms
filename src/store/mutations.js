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
