import server from '@/libs/js/server'
import * as types from './mutationTypes'
import Cargo from '../libs/cargo'
export default {
  /**
   * 根据客户名，查询客户列表
   * @param {*} store
   * @param {*} name
   */
  getClients ({ state, commit }, name) {
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
        // 收货人信息，包含客户信息
        const clients = response.data.data.list
        // 客户列表
        // const clientList = clients.map((user) => ({name: user.name, value: user.name, id: user.id}))
        if (clients && clients.length > 0) {
          commit(types.RECEIVE_CLIENT_LIST, clients)
        }
        // resolve(clientList)
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
  getConsignerDetail ({ state, commit }, id) {
    return new Promise((resolve, reject) => {
      server({
        method: 'get',
        url: 'consigner/detail',
        params: {
          id
        }
      }).then((response) => {
        const { addressList, cargoList, consigneeList, ...consigner } = response.data.data
        consigner.id = id
        commit(types.RECEIVE_CONSIGNERS_LIST, [consigner])
        if (addressList.length > 0) {
          // 发货地址
          commit(types.RECEIVE_ADDRESS_LIST, addressList)
        }
        if (cargoList.length > 0) {
          // 货物信息
          commit(types.RECEIVE_CARGO_LIST, cargoList)
          commit(types.RECEIVE_CONSIGNER_CARGO_LIST, cargoList.map((cargo) => {
            return new Cargo(cargo)
          }))
        }
        if (consigneeList.length > 0) {
          // 收货方地址
          commit(types.RECEIVE_CONSIGNEES_LIST, consigneeList)
        }
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
  appendCargo ({ commit }, index) {
    commit(types.APPEND_CONSIGNER_CARGO, index + 1)
  },
  /**
   * 删除一行
   * @param {*} store
   * @param {*} index
   */
  removeCargo ({state, commit}, index) {
    if (state.order.consignerCargoes.length === 1) {
      return
    }
    commit(types.REMOVE_CONSIGNER_CARGO, index)
  },
  /**
   * 修改一行货物信息（部分信息修改）
   * @param {*} store
   * @param {*} item
   */
  updateCargo ({ state, commit }, item) {
    commit(types.UPDATE_CONSIGNER_CARGO, item)
  },
  /**
   * 修改一行数据，完全修改
   * @param {*} store
   * @param {*} item
   */
  fullUpdateCargo ({ commit }, item) {
    item.cargo = new Cargo(item.cargo)
    commit(types.UPDATE_FULL_CONSIGNER_CARGO, item)
  },
  clearCargoes (store) {
    store.commit(types.CLEAR_CONSIGNER_CARGO_LIST)
    store.commit(types.RECEIVE_CARGO_LIST, [])
  },
  clearOrderDetail ({ commit }) {
    commit(types.RECEIVE_ORDER_DETAIL, {})
  },
  /**
   * 查询订单详情
   * @param {*} store
   * @param {*} id
   */
  getOrderDetail ({ state, commit }, id) {
    return new Promise((resolve, reject) => {
      server({
        method: 'get',
        url: 'order/detail',
        data: {
          id
        }
      })
        .then((response) => {
          const { orderCargoList, ...order } = response.data.data
          commit(types.RECEIVE_CONSIGNER_CARGO_LIST, orderCargoList.map((item) => new Cargo(item)))
          commit(types.RECEIVE_ORDER_DETAIL, order)
          resolve(order)
        })
        .catch((err) => reject(err))
    })
  },
  // 提交表单
  submitOrder ({ state }, form) {
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
