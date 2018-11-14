/**
 * 发货方列表
 * 根据发货方id查询发货方关联的发货地址，联系人，手机号以及对应的收货人相关信息
 * @Author: mayousheng:Y010220
 * @Date: 2018-11-14 11:33:43
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-11-14 11:34:23
 */

import * as types from './mutationTypes'
import server from '@/libs/js/server'
import Cargo from '../../../views/order/create/libs/cargo'
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
        params: {}
      }).then((response) => {
        // 收货人信息，包含客户信息
        const clients = response.data.data.list
        // 客户列表
        // const clientList = clients.map((user) => ({name: user.name, value: user.name, id: user.id}))
        if (clients && clients.length > 0) {
          commit(types.RECEIVE_CLIENT_LIST, clients)
        } else {
          commit(types.RECEIVE_CLIENT_LIST, [])
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
        commit(types.RECEIVE_CONTACT_LIST, [consigner])
        // 发货地址
        commit(types.RECEIVE_ADDRESS_LIST, addressList || [])
        if (cargoList.length > 0) {
          const transformCargoList = cargoList.map((cargo) => new Cargo(cargo, true))
          // 货物信息
          commit(types.RECEIVE_CARGO_LIST, transformCargoList)
        } else {
          commit(types.RECEIVE_CARGO_LIST, [])
        }
        // 收货方地址
        commit(types.RECEIVE_CONSIGNEES_LIST, consigneeList || [])
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 清除货品信息
   * @param {*} store
   */
  clearCargoes (store) {
    // store.commit(types.CLEAR_CONSIGNER_CARGO_LIST)
    store.commit(types.RECEIVE_CARGO_LIST, [])
  },
  /**
   * 清除公司列表
   * @param {*} param0
   */
  clearClients ({ commit }) {
    commit(types.RECEIVE_CLIENT_LIST, [])
  }
}
