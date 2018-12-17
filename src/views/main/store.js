import { getMenuByRouter } from './util/menu'
import router from '@/router.js'
export default {
  actions: {

  },
  state: {
    tabNavList: [{ name: 'home', path: '/', query: { title: '首页', notCache: true } }]
  },
  getters: {
    menuList: (state, getters, rootState) => {
      return getMenuByRouter(router.options.routes, rootState.permissions)
    },
    TabNavList: (state) => state.tabNavList
  },
  mutations: {
    setTabNavList (state, list) {
      state.tabNavList = [...list]
    }
  }
}
