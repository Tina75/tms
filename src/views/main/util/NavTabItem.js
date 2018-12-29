let uniqid = 0
class NavTabItem {
  constructor (manager, options) {
    this.id = uniqid++
    this.name = options.name
    this.path = options.path
    this.title = options.query.title || options.meta.title
    this.meta = options.meta
    this.query = options.query || {}
    // 刷新
    this.reload = false
    this.prevId = -1
    // 默认选中
    this.isActive = true
    this.manager = manager
  }
  close () {
    return this.manager.removeNavTab(this)
  }
  refresh (callback) {
    return this.manager.refreshNavTab(this, callback)
  }
}

export default NavTabItem
