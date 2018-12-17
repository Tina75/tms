import store from '@/store/index'
import NavTagItem from './NavTabItem'
class NavTabManager {
  constructor () {
    this.queue = []
  }
  addNavTab (route) {
    let navtag = new NavTagItem(this, route)
    this.queue.push(navtag)
    store.dispatch('addNavTab', navtag)
  }

  removeNavTab (nav) {
    if (this.findNavTab(nav.id)) {
      this.queue = this.queue.filter((item) => item.id !== nav.id)
      store.dispatch('removeNavTag', nav)
    }
  }
  findNavTab (id) {
    return this.queue.find(nav => nav.id === id)
  }
}
export default new NavTabManager()
