import { getMenuByRouter } from './util/menu'
import router from '@/router.js'

export default {
  actions: {
    addNavTab ({ commit, dispatch }, navItem) {
      commit('addNavTab', navItem)
    },
    removeNavTab ({ commit }, navItem) {
      commit('removeNavTab', navItem)
    }
  },
  state: {
    // { name: 'home', path: '/', query: { title: '首页', notCache: true } }
    navTabList: []
  },
  getters: {
    menuList: (state, getters, rootState) => {
      return getMenuByRouter(router.options.routes, rootState.permissions)
    },
    NavTabList: (state) => state.navTabList
  },
  mutations: {
    setNavTabList (state, list) {
      state.navTabList = [...list]
    },
    addNavTab (state, tab) {
      state.navTabList.push(tab)
    },
    removeNavTab (state, tab) {
      state.navTabList = state.navTabList.find((item) => item.id !== tab.id)
    }
  }
}
