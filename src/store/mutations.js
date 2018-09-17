export default{
  initUserInfo (state, payload) {
    state.userInfo = payload
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
