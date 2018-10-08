import * as types from './mutationTypes'
import * as actions from './actions'
import * as getters from './getters'

const state = {
  accountQuerySave: {
    name: '',
    beginTime: '',
    endTime: '',
    status: '',
    pageSize: 10,
    pageNo: 1
  },
  communicateStatusMap: {
    '0': '未沟通',
    '1': '已沟通'
  },
  accountData: {},
  accountDetail: {}
}

const mutations = {
  [types.SET_ACCOUNT_QUERY] (state, query) {
    Object.assign(state.accountQuerySave, query)
  },
  [types.SET_ACCOUNT_DATA] (state, data) {
    state.accountData = data
  },
  [types.SET_ACCOUNT_DETAIL] (state, data) {
    state.accountDetail = data
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}
