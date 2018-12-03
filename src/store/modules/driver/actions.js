import * as types from './mutationTypes'
import server from '@/libs/js/server'

export default {
  /**
   * 获取所有自有车辆信息
   * @param {object} param0
   */
  getOwnCars ({ state, commit }) {
    return new Promise((resolve, reject) => {
      server({
        url: 'http://yapi.yundada56.com/mock/214/owerCar/findCarList',
        method: 'get'
      })
        .then((response) => {
          const cars = response.data.data
          commit(types.RECEIVE_OWN_CAR_LIST, cars)
          resolve(cars)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  /**
   * 获取所有司机
   * @param {object} param0
   */
  getOwnDrivers ({ state, commit }) {
    return new Promise((resolve, reject) => {
      server({
        url: 'http://yapi.yundada56.com/mock/214/owerCar/listDriverList',
        method: 'get'
      })
        .then((response) => {
          const drivers = response.data.data
          commit(types.RECEIVE_OWN_DRIVER_LIST, drivers)
          resolve(drivers)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
