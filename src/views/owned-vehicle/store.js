import Server from '@/libs/js/server'
export default {
  actions: {
    insuranceQueryById () {
      return Server({
        url: '/ownerCar/insurance/detail',
        method: 'get'
      })
    },
    insuranceDeleteById () {
      return Server({
        url: '/ownerCar/insurance/delete',
        method: 'get'
      })
    },
    checkQueryById () {
      return Server({
        url: '/ownerCar/check/detail',
        method: 'get'
      })
    },
    checkDeleteById () {
      return Server({
        url: '/ownerCar/check/delete',
        method: 'get'
      })
    },
    tyreQueryById () {
      return Server({
        url: '/ownerCar/tire/detail',
        method: 'get'
      })
    },
    tyreDeleteById () {
      return Server({
        url: '/ownerCar/tire/delete',
        method: 'get'
      })
    }
  },
  state: {},
  getters: {},
  mutations: {}
}
