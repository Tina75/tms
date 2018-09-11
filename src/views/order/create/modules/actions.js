import server from '@/libs/js/server'
import * as types from './mutationTypes'
export default {
  getClients ({state, commit}, name) {
    return new Promise((resolve, reject) => {
      const { pageNo, pageSize } = state.order.pagination
      server({
        method: 'get',
        url: 'consigner/list',
        params: {
          pageNo: pageNo,
          pageSize: pageSize,
          name
        }
      }).then((response) => {
        // 客户列表
        const clientList = response.data.data.consignerList.map((user) => ({name: user.name, value: user.name, id: user.id}))
        // 收货人信息，包含客户信息
        const clients = response.data.data.consignerList
        commit(types.RECEIVE_CLIENT_LIST, clients)
        resolve(clientList)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getConsignerDetail ({state, commit}, consignerId) {
    return new Promise((resolve, reject) => {
      server({
        method: 'get',
        url: 'consigner/detail',
        params: {
          consignerId
        }
      }).then((response) => {
        const { addressList, cargoList, consigneeList, consigner } = response.data.data
        commit(types.RECEIVE_CONSIGNERS_LIST, [consigner])
        // 发货地址
        commit(types.RECEIVE_ADDRESS_LIST, addressList)
        // 货物信息
        commit(types.RECEIVE_CARGO_LIST, cargoList)
        commit(types.RECEIVE_CONSIGNER_CARGO_LIST, cargoList.map((cargo) => {
          cargo.quantity = 1
          return cargo
        }))
        // 收货方地址
        commit(types.RECEIVE_CONSIGNEES_LIST, consigneeList)
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  appendCargo ({commit}, index) {
    commit(types.APPEND_CONSIGNER_CARGO, index + 1)
  },
  removeCargo ({state, commit}, index) {
    if (state.order.cargoes.length === 1) {
      return
    }
    commit(types.REMOVE_CONSIGNER_CARGO, index)
  },
  updateCargo ({state, commit}, item) {
    commit(types.UPDATE_CONSIGNER_CARGO, item)
  },
  fullUpdateCargo ({commit}, item) {
    commit(types.UPDATE_FULL_CONSIGNER_CARGO, item)
  },
  clearCargoes (store) {
    store.commit(types.CLEAR_CONSIGNER_CARGO_LIST)
  },
  // 提交表单
  submitOrder ({state}, form) {
    return new Promise((resolve, reject) => {
      server({
        method: 'post',
        url: 'order/create',
        data: {
          ...form
        }
      })
        .then((response) => resolve(response))
        .catch((err) => reject(err))
    })
  }
}
