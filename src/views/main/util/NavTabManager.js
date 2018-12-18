import store from '@/store/index'
import NavTagItem from './NavTabItem'
class NavTabManager {
  queue () {
    return store.getters.NavTabList
  }
  /**
   * 新增tab
   * @param {object} route
   */
  addNavTab (route) {
    if (route.path === '/') {
      return
    }
    let findedTab = this.existTab(route)
    if (findedTab) {
      // 切换其他tab
      store.dispatch('setActiveTab', findedTab.id)
    } else if (this.reload) {
      // 刷新
      let navtab = new NavTagItem(this, route)
      store.dispatch('refreshNavTab', { navTab: navtab, index: this.reloadIndex })
      this.reload = false
      this.reloadIndex = -1
    } else {
      // 打开新tab
      let navtab = new NavTagItem(this, route)
      store.dispatch('addNavTab', navtab)
    }
  }

  refreshNavTab (nav) {
    this.reloadIndex = this.queue().findIndex((item) => item.id === nav.id)
    this.reload = true
  }

  getActiveTab () {
    return this.queue().find((tab) => tab.isActive)
  }
  /**
   * 删除tab
   * @param {object} nav
   */
  removeNavTab (nav) {
    let removeTab = this.findNavTab(nav.id)
    if (removeTab) {
      let nextTabId = removeTab.prevId
      let nextTab
      // 关闭的是当前选中的tab
      if (removeTab.isActive) {
        nextTab = this.findNavTab(nextTabId)
        // 如果关联的tab已经不存在就查询左边的
        if (!nextTab) {
          let nextIndex = this.queue().findIndex((item) => item.id === nav.id)
          // 优先左边的选中
          if (nextIndex > 0) {
            nextTab = this.queue()[nextIndex - 1]
          } else {
            nextTab = this.queue()[nextIndex + 1]
          }
        }
      }
      store.dispatch('removeNavTab', nav)
      // store.dispatch('setActiveTabClass', nextTabId)
      return nextTab
    }
  }
  /**
   * 是否存在，通过id
   * @param {number} id
   */
  findNavTab (id) {
    return this.queue().find(nav => nav.id === id)
  }
  /**
   * 是否存在，通过title 和 path
   * @param {object} route
   */
  existTab (route) {
    return this.queue().find((item) => item.title === (route.query.title || route.meta.title) && item.path === route.path)
  }
}
export default new NavTabManager()
