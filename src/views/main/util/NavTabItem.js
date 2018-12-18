let uniqid = 0
class NavTabItem {
  constructor (manager, options) {
    this.id = uniqid++
    this.name = options.name
    this.path = options.path
    this.title = options.meta.title
    this.meta = options.meta
    this.query = options.query || {}

    this.prevId = -1
    // 默认选中
    this.isActive = true
    this.manager = manager
  }
  close () {
    return this.manager.removeNavTab(this)
  }
  refresh () {
    return this.manager.refreshNavTab(this)
  }
}

export default NavTabItem
