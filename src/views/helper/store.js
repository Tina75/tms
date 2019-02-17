import Server from '@/libs/js/server'
export default {
  actions: {
    saveOpinion: ({ state, commit, rootState }, params) => {
      return Server({
        url: 'suggestion/add',
        method: 'post',
        data: params
      })
    }
  },
  state: {},
  getters: {},
  mutations: {}
}
