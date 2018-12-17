import { getMenuByRouter } from './util/menu'
import router from '@/router.js'

export default {
  actions: {
    addNavTab ({ commit, dispatch }, navItem) {
      commit('addNavTab', navItem)
    },
    setActiveTabClass ({ commit }, id) {
      commit('setActiveTabClass', id)
    },
    removeNavTab ({ commit }, navItem) {
      commit('removeNavTab', navItem)
    },
    removeActiveTabClass ({ commit }) {
      commit('removeActiveTabClass')
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
    },
    removeActiveTabClass (state) {
      let tab = state.navTabList.find((item) => item.isActive)
      if (tab) {
        tab.isActive = false
      }
    },
    setActiveTabClass (state, id) {
      let tab = state.navTabList.find((item) => item.id === id)
      tab.isActive = true
    }
  }
}
