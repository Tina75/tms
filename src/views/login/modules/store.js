import * as types from './mutationTypes'
import * as getters from './getters'
import validate from '@/libs/js/validate'

const state = {
  login: {
    phone: ''
  }
}

const mutations = {
  [types.USER_PHONE] ({ login }, phone) {
    if (validate.phone(phone)) login.phone = phone
  }
}

export default {
  state,
  getters,
  mutations
}
