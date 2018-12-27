import Server from '@/libs/js/server'
export default {
  actions: {
    insuranceQueryById ({ state, commit, rootState }, params) {
      return Server({
        url: '/ownerCar/insurance/detail',
        method: 'get',
        data: params
      })
    },
    insuranceDeleteById ({ state, commit, rootState }, params) {
      return Server({
        url: '/ownerCar/insurance/delete',
        method: 'get',
        data: params
      })
    },
    checkQueryById ({ state, commit, rootState }, params) {
      return Server({
        url: '/ownerCar/check/detail',
        method: 'get',
        data: params
      })
    },
    checkDeleteById ({ state, commit, rootState }, params) {
      return Server({
        url: '/ownerCar/check/delete',
        method: 'get',
        data: params
      })
    },
    tyreQueryById ({ state, commit, rootState }, params) {
      return Server({
        url: '/ownerCar/tire/detail',
        method: 'get',
        data: params
      })
    },
    tyreDeleteById ({ state, commit, rootState }, params) {
      return Server({
        url: '/ownerCar/tire/delete',
        method: 'get',
        data: params
      })
    }
  },
  state: {},
  getters: {},
  mutations: {}
}
