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
    let findedTab = this.existTab(route)
    if (findedTab) {
      store.dispatch('removeActiveTabClass')
      store.dispatch('setActiveTabClass', findedTab.id)
      return
    }
    let navtag = new NavTagItem(this, route)
    store.dispatch('removeActiveTabClass')
    store.dispatch('addNavTab', navtag)
  }

  reloadNavTab (nav) {

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
      let nextTab = this.findNavTab(nextTabId)
      if (nextTab) {
        let nextIndex = this.queue().findIndex((item) => item.id === nav.id)
        nextTab = this.queue()[nextIndex - 1]
      }
      store.dispatch('removeNavTag', nav)
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
