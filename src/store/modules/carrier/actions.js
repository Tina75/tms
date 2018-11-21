import * as types from './mutationTypes'
import server from '@/libs/js/server'
export default {
  /**
   * 承运商列表_根据修改时间倒序
   * @param {*} type   搜索类型 1 承运商名称 2 承运商联系人
   * @param {*} keyword
   */
  getCarriers ({ state, commit }) {
    return new Promise((resolve, reject) => {
      // const { pageNo, pageSize } = state.order.pagination
      server({
        method: 'get',
        url: 'carrier/listOrderByUpdateTimeDesc',
        params: {
          // pageNo: pageNo,
          // pageSize: pageSize,
          type: 1,
          keyword: null
        }
      }).then((response) => {
        // 承运商信息
        const carriers = response.data.data.list
        commit(types.RECEIVE_CARRIER_LIST, carriers)
        resolve(carriers)
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
        url: 'carrier/list/carOrderByUpdateTimeDesc',
        params: {
          // pageNo: pageNo,
          // pageSize: pageSize,
          carrierId
        }
      }).then((response) => {
        // 承运商车辆信息
        const carrierCars = response.data.data.list
        commit(types.RECEIVE_CARRIER_CAR_LIST, carrierCars)
        resolve(carrierCars)
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
        const carrierDrivers = response.data.data.list
        commit(types.RECEIVE_CARRIER_DRIVER_LIST, carrierDrivers)
        resolve(carrierDrivers)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
