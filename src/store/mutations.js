import store from '.'

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
// tab 相关
export const changeTab = (state, data) => {
  let list = state.tabNav.tabList
  if (typeof data === 'string') {
    state.tabNav.currTab = { href: data }
    if (!list.some(item => { return item.path === data })) {
      list.push({ path: data })
      store.commit('updateTabList', list)
    }
  } else {
    state.tabNav.currTab = data
    if (!list.some(item => { return item.href === data.href })) {
      list.push(data)
      store.commit('updateTabList', list)
    }
  }
}
export const updateTabList = (state, data) => {
  state.tabNav.tabList = data || []
}

// export const powerControl = (state, data) => {
//   state.powerControl = data
// }
