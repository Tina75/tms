import { getMenuByRouter } from './util/menu'
import router from '@/router.js'

export default {
  actions: {
    /**
     * 打开新的路由地址
     * 1. 去除之前的tab 选中状态
     * 2. 添加标签
     * 3. 关联上下间关系
     * @param {*} param0
     * @param {*} navItem
     */
    addNavTab ({ commit, dispatch, state }, navItem) {
      let prevActiveTab = state.navTabList.find(item => item.isActive)
      commit('removeActiveTabClass')
      commit('addNavTab', navItem)
      if (prevActiveTab) {
        commit('setRelationTab', { nextId: navItem.id, prevId: prevActiveTab.id })
      }
    },
    /**
     * 已有tab之间切换
     * 1. 删除之前的tab选中状态
     * 2. 设置当前的tab选中
     * 3. 设置上下间关系
     * @param {*} param0
     * @param {*} id
     */
    setActiveTab ({ commit, state }, id) {
      let prevActiveTab = state.navTabList.find(item => item.isActive)
      commit('removeActiveTabClass')
      commit('setActiveTab', id)
      if (prevActiveTab) {
        commit('setRelationTab', { nextId: id, prevId: prevActiveTab.id })
      }
    },
    /**
     * 关闭tab
     * @param {*} param0
     * @param {*} navItem
     */
    removeNavTab ({ commit }, navItem) {
      commit('removeNavTab', navItem)
    },
    /**
     * 刷新tab
     * @param {*} param0
     * @param {object} {index,type} params 1:新增refresh=true，2：refresh = false
     */
    refreshNavTab ({ commit }, params) {
      // commit('removeActiveTabClass')
      commit('refreshNavTab', params)
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
    refreshNavTab (state, params) {
      const { index, type } = params
      let tab = state.navTabList[index]
      if (type === 1) {
        tab.reload = true
      } else {
        tab.reload = false
      }
      // state.navTabList.splice(index, -1, navTab)
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
