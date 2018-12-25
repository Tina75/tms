import store from '@/store/index'
import NavTagItem from './NavTabItem'
class NavTabManager {
  constructor () {
    // 黑名单，不计入tab
    this.blackList = ['/', '/404', '/500', '/405', '/loading']
  }
  queue () {
    return store.getters.NavTabList
  }
  /**
   * 新增tab
   * @param {object} route
   */
  addNavTab (route) {
    if (this.blackList.includes(route.path)) {
      return
    }
    let findedTab = this.existTab(route)
    if (findedTab) {
      if (this.reload) {
        store.dispatch('refreshNavTab', { index: this.reloadIndex, type: 2 })
        this.reload = false
        this.reloadIndex = -1
        return
      }
      // 切换其他tab
      store.dispatch('setActiveTab', findedTab.id)
    } else {
      // 打开新tab
      let navtab = new NavTagItem(this, route)
      store.dispatch('addNavTab', navtab)
    }
  }
  /**
   * 刷新tab
   * 1. 先找到需要刷新tab的索引位置，设置下次渲染模式是刷新
   * 2. 进入到loading路由
   * 3. 在推入原先刷新的标签
   * @param {*} refreshNavTab
   */
  refreshNavTab (refreshNavTab, callback) {
    this.reloadIndex = this.queue().findIndex((item) => item.id === refreshNavTab.id)
    this.reload = true
    if (callback) {
      callback()
    }
    store.dispatch('refreshNavTab', { index: this.reloadIndex, type: 1 })
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
        // 通过关联id找到下一个标签
        if (nextTabId && nextTabId !== -1) {
          nextTab = this.findNavTab(nextTabId)
        }
        // 如果关联的tab已经不存在就查询左边的,并且保证剩余的tab大于1
        if (!nextTab && this.queue().length > 1) {
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
