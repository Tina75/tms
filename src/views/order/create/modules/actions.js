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
      // const { pageNo, pageSize } = state.order.pagination
      server({
        method: 'get',
        url: 'consigner/list',
        params: {
          // pageNo: pageNo,
          // pageSize: pageSize,
          // name
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
          // commit(types.RECEIVE_CONSIGNER_CARGO_LIST, cargoList.map((cargo) => {
          //   return new Cargo(cargo, true)
          // }))
          commit(types.RECEIVE_CONSIGNER_CARGO_LIST, [new Cargo(cargoList[0], true)])
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
  /**
   * 清除货品信息
   * @param {*} store
   */
  clearCargoes (store) {
    store.commit(types.CLEAR_CONSIGNER_CARGO_LIST)
    store.commit(types.RECEIVE_CARGO_LIST, [])
  },
  /**
   * 清除订单详情
   * @param {*} param0
   */
  clearOrderDetail ({ commit }) {
    commit(types.RECEIVE_ORDER_DETAIL, {})
  },
  /**
   * 清除公司列表
   * @param {*} param0
   */
  clearClients ({commit}) {
    commit(types.RECEIVE_CLIENT_LIST, [])
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
          commit(types.RECEIVE_CONSIGNER_CARGO_LIST, orderCargoList.map((item) => new Cargo(item, true)))
          commit(types.RECEIVE_ORDER_DETAIL, order)
          resolve(order)
        })
        .catch((err) => reject(err))
    })
  },
  // 提交表单
  submitOrder ({ state, rootState }, form) {
    let url = 'order/create'
    if (form.id) {
      url = 'order/update'
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
  },

  /**
   * 查询承运商列表
   * @param {*} type
   * @param {*} keyword
   */
  getCarriers ({ state, commit }) {
    return new Promise((resolve, reject) => {
      // const { pageNo, pageSize } = state.order.pagination
      server({
        method: 'get',
        url: 'carrier/list',
        params: {
          // pageNo: pageNo,
          // pageSize: pageSize,
          type: 1,
          keyword: null,
          order: 'create_time,asc'
        }
      }).then((response) => {
        // 承运商信息
        const carriers = response.data.data.carrierList
        commit(types.RECEIVE_CARRIER_LIST, carriers)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 根据承运商id查询其下属车辆
   * @param {*} carrierId
   */
  getCarrierCars ({ state, commit }, carrierId) {
    return new Promise((resolve, reject) => {
      // const { pageNo, pageSize } = state.order.pagination
      server({
        method: 'get',
        url: 'carrier/list/car',
        params: {
          // pageNo: pageNo,
          // pageSize: pageSize,
          carrierId
        }
      }).then((response) => {
        // 承运商车辆信息
        const carrierCars = response.data.data.carList
        commit(types.RECEIVE_CARRIER_CAR_LIST, carrierCars)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 根据承运商id查询其下属司机
   * @param {*} carrierId
   */
  getCarrierDrivers ({ state, commit }, carrierId) {
    return new Promise((resolve, reject) => {
      // const { pageNo, pageSize } = state.order.pagination
      server({
        method: 'get',
        url: 'carrier/list/driver',
        params: {
          // pageNo: pageNo,
          // pageSize: pageSize,
          carrierId
        }
      }).then((response) => {
        // 承运商车辆信息
        const carrierDrivers = response.data.data.driverList
        commit(types.RECEIVE_CARRIER_DRIVER_LIST, carrierDrivers)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  /**
   * 外转方列表
   * @param {*} type 1 外转方名称  2 负责人
   * @param {*} keyword
   */
  getTransferees ({ state, commit }) {
    return new Promise((resolve, reject) => {
      // const { pageNo, pageSize } = state.order.pagination
      server({
        method: 'get',
        url: 'transferee/list',
        params: {
          // pageNo: pageNo,
          // pageSize: pageSize,
          type: 1,
          keyword: null,
          order: 'create_time,asc'
        }
      }).then((response) => {
        // 外转方信息
        const transferees = response.data.data.transfereeList
        commit(types.RECEIVE_TRANSFEREE_LIST, transferees)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
