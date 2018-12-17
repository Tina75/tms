import { getMenuByRouter } from './util/menu'
import router from '@/router.js'
export default {
  actions: {

  },
  state: {
    tabNavList: [{ name: 'home', path: '/', meta: { title: '首页', notCache: true } }]
  },
  getters: {
    menuList: (state, getters, rootState) => {
      return getMenuByRouter(router.options.routes, rootState.permissions)
    },
    tabNavList: (state) => state.tabNavList
  },
  mutations: {
    SET_TABNAV_LIST (state, list) {
      state.tabNavList = [...list]
    }
  }
}
