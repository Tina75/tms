import { getMenuByRouter } from './util/menu'
import router from '@/router.js'

export default {
  actions: {
    addNavTab ({ commit, dispatch, state }, navItem) {
      let prevActiveTab = state.navTabList.find(item => item.isActive)
      commit('removeActiveTabClass')
      commit('addNavTab', navItem)
      if (prevActiveTab) {
        commit('setRelationTab', { nextId: navItem.id, prevId: prevActiveTab.id })
      }
    },
    setActiveTab ({ commit, state }, id) {
      let prevActiveTab = state.navTabList.find(item => item.isActive)
      commit('removeActiveTabClass')
      commit('setActiveTab', id)
      if (prevActiveTab) {
        commit('setRelationTab', { nextId: id, prevId: prevActiveTab.id })
      }
    },
    removeNavTab ({ commit }, navItem) {
      commit('removeNavTab', navItem)
    },
    refreshNavTab ({ commit }, navItem) {
      commit('refreshNavTab', navItem)
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
      state.navTabList = state.navTabList.filter((item) => item.id !== tab.id)
    },
    refreshNavTab (state, tab) {
      const { index, navTab } = tab
      state.navTabList.splice(index, -1, navTab)
    },
    removeActiveTabClass (state) {
      let tab = state.navTabList.find((item) => item.isActive)
      if (tab) {
        tab.isActive = false
      }
    },
    setActiveTab (state, id) {
      let tab = state.navTabList.find((item) => item.id === id)
      tab.isActive = true
    },
    setRelationTab (state, { nextId, prevId }) {
      let tab = state.navTabList.find((item) => item.id === nextId)
      tab.prevId = prevId
    }
  }
}
