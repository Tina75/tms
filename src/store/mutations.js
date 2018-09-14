// import store from '.'

export const initMenuData = (state, data) => {
  state.app.menuData = data
}
export const initUserInfo = (state, data) => {
  state.userInfo = data
}

export const changeActiveIndex = (state, data) => {
  // 通过更新子节点修改对应导航的列表信息
  state.app.activeIndex = data
}
// // tab 相关
// export const changeTab = (state, data) => {
//   console.log('changeTab')
//   let list = state.tabNav.tabList
//   if (typeof data === 'string') {
//     state.tabNav.currTab = { path: data }
//     if (!list.some(item => item.path === data)) {
//       list.push({ path: data })
//       store.commit('updateTabList', list)
//     }
//   } else {
//     state.tabNav.currTab = data
//     if (!list.some(item => item.path === data.path)) {
//       list.push(data)
//       store.commit('updateTabList', list)
//     }
//   }
// }
/**
 *  更新tabNav列表
 */
export const setTabNavList = (state, list) => {
  state.tabNavList = [...list]
}

// /**
//  * 关闭tab页
//  * @param {*} state
//  * @param {*} {list:更新后list,name:关闭的标签名}
//  */
// export const closeTab = (state, data) => {
//   console.log('closeTab')
//   let list = state.tabNav.tabList
//   const idx = list.findIndex(element => {
//     return element.name === data
//   })
//   store.commit('setCurrTab', list[idx - 1])
//   list.splice(idx, 1)
//   store.commit('updateTabList', list)
// }

// export const setCurrTab = (state, data) => {
//   console.log('setCurrTab')
//   state.tabNav.currTab = data
// }
// export const updateTabList = (state, data) => {
//   console.log('updateTabList')
//   console.log('修改前' + JSON.stringify(state.tabNav.tabList))
//   state.tabNav.tabList = data || []
//   console.log('修改后' + JSON.stringify(state.tabNav.tabList))
// }

// export const powerControl = (state, data) => {
//   state.powerControl = data
// }
