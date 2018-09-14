import server from '@/libs/js/server'
import * as types from './mutationTypes'
export default {
  /**
   * 根据客户名，查询客户列表
   * @param {*} store
   * @param {*} name
   */
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
        const clientList = response.data.data.list.map((user) => ({name: user.name, value: user.name, id: user.id}))
        // 收货人信息，包含客户信息
        const clients = response.data.data.consignerList
        commit(types.RECEIVE_CLIENT_LIST, clients)
        resolve(clientList)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 根据发货方id查询详情
   * @param {*} store
   * @param {*} consignerId
   */
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
        commit(types.RECEIVE_ADDRESS_LIST, addressList.list)
        // 货物信息
        commit(types.RECEIVE_CARGO_LIST, cargoList.list)
        commit(types.RECEIVE_CONSIGNER_CARGO_LIST, cargoList.list.map((cargo) => {
          cargo.quantity = 1
          return cargo
        }))
        // 收货方地址
        commit(types.RECEIVE_CONSIGNEES_LIST, consigneeList.list)
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 添加一行货物信息
   * @param {*} store
   * @param {*} index
   */
  appendCargo ({commit}, index) {
    commit(types.APPEND_CONSIGNER_CARGO, index + 1)
  },
  /**
   * 删除一行
   * @param {*} store
   * @param {*} index
   */
  removeCargo ({state, commit}, index) {
    if (state.order.cargoes.length === 1) {
      return
    }
    commit(types.REMOVE_CONSIGNER_CARGO, index)
  },
  /**
   * 修改一行货物信息（部分信息修改）
   * @param {*} store
   * @param {*} item
   */
  updateCargo ({state, commit}, item) {
    commit(types.UPDATE_CONSIGNER_CARGO, item)
  },
  /**
   * 修改一行数据，完全修改
   * @param {*} store
   * @param {*} item
   */
  fullUpdateCargo ({commit}, item) {
    commit(types.UPDATE_FULL_CONSIGNER_CARGO, item)
  },
  clearCargoes (store) {
    store.commit(types.CLEAR_CONSIGNER_CARGO_LIST)
    store.commit(types.RECEIVE_CARGO_LIST, [])
  },
  clearOrderDetail ({commit}) {
    commit(types.RECEIVE_ORDER_DETAIL, {})
  },
  /**
   * 查询订单详情
   * @param {*} store
   * @param {*} id
   */
  getOrderDetail ({state, commit}, id) {
    return new Promise((resolve, reject) => {
      server({
        method: 'get',
        url: 'order/detail',
        data: {
          id
        }
      })
        .then((response) => {
          const {orderCargoList, ...order} = response.data.data
          commit(types.RECEIVE_CONSIGNER_CARGO_LIST, orderCargoList)
          commit(types.RECEIVE_ORDER_DETAIL, order)
          resolve(order)
        })
        .catch((err) => reject(err))
    })
  },
  // 提交表单
  submitOrder ({state}, form) {
    let url = 'order/create'
    if (state.order.detail.id) {
      url = 'order/update'
      form.id = state.order.detail.id
    }

    return new Promise((resolve, reject) => {
      server({
        method: 'post',
        url,
        data: {
          ...form
        }
      })
        .then((response) => resolve(response))
        .catch((err) => reject(err))
    })
  }
}
