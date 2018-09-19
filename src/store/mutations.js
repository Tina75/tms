export default{
  initUserInfo (state, payload) {
    state.userInfo = Object.assign(state.userInfo, payload)
  },
  initPermissions (state, payload) {
    state.permissions = payload || []
  },
  setTabNavList (state, list) {
    state.tabNavList = [...list]
    localStorage.tabNavCache = JSON.stringify([...list])
  },
  initTabNav (state) {
    state.tabNavList = localStorage.tabNavCache ? JSON.parse(localStorage.tabNavCache) : []
  },
  updateMsgCount (state, payload) {
    const msg = {...payload}
    msg.all = msg.sysNum + msg.orderNum + msg.carrierNum
    state.messageCount = msg
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
