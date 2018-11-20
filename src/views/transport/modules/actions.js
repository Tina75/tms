import * as types from './mutationTypes'
import Server from '@/libs/js/server'
import { setTabList as setWaybillTab } from '../constant/waybill'
import { setTabList as setPickupTab } from '../constant/pickup'

export default {
  // 根据订单号查询货物详情
  getCargoDetail (store, orderIds) {
    return new Promise((resolve, reject) => {
      if (!orderIds.length) reject(new Error('miss orderIds'))
      Server({
        url: '/order/cargo/detail',
        method: 'post',
        data: { orderIds }
      }).then(res => {
        resolve(res.data.data.cargoList)
      }).catch(err => {
        reject(err)
      })
    })
  },

  /**
   * 送货管理
   */

  // 删除运单
  deleteWaybills (store, waybillIds) {
    return new Promise((resolve, reject) => {
      if (!waybillIds.length) reject(new Error('miss waybillIds'))
      Server({
        url: '/waybill/delete',
        method: 'delete',
        data: { waybillIds }
      }).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 打印运单
  getWaybillPrintData (store, waybillIds) {
    return new Promise((resolve, reject) => {
      if (!waybillIds.length) reject(new Error('miss waybillIds'))
      Server({
        url: '/waybill/batchPrint',
        method: 'post',
        data: { waybillIds }
      }).then(res => {
        resolve(res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 查询运单车辆位置
  getWaybillLocation (store, waybillIds) {
    return new Promise((resolve, reject) => {
      if (!waybillIds.length) reject(new Error('miss waybillIds'))
      Server({
        url: waybillIds.length > 1 ? '/waybill/location' : '/waybill/single/location',
        method: 'post',
        data: waybillIds.length > 1 ? ({ waybillIds }) : ({ waybillId: waybillIds[0] })
      }).then(res => {
        resolve(res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 运单派车
  waybillSendCarCheck (store, waybillIds) {
    return new Promise((resolve, reject) => {
      if (!waybillIds.length) reject(new Error('miss waybillIds'))
      Server({
        url: '/waybill/check/order',
        method: 'post',
        data: { waybillIds }
      }).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 运单发运
  waybillShipment (store, waybillIds) {
    return new Promise((resolve, reject) => {
      if (!waybillIds.length) reject(new Error('miss waybillIds'))
      Server({
        url: '/waybill/shipment',
        method: 'post',
        data: { waybillIds }
      }).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 运单到货
  waybillArrival (store, waybillIds) {
    return new Promise((resolve, reject) => {
      if (!waybillIds.length) reject(new Error('miss waybillIds'))
      Server({
        url: '/waybill/confirm/arrival',
        method: 'post',
        data: { waybillIds }
      }).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取运单列表tab count
  getwaybillTabCount ({ commit }) {
    Server({
      url: '/waybill/tab/cnt',
      method: 'get'
    }).then(res => {
      commit(types.WAYBILL_TAB_COUNT, setWaybillTab(res.data.data))
    })
  },

  /**
   * 提货管理
   */

  // 删除提货单
  deletePickupOrders (store, pickUpIds) {
    return new Promise((resolve, reject) => {
      if (!pickUpIds.length) reject(new Error('miss pickUpIds'))
      Server({
        url: '/load/bill/delete',
        method: 'delete',
        data: { pickUpIds }
      }).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 打印提货单
  getPickupOrderPrintData (store, pickUpIds) {
    return new Promise((resolve, reject) => {
      if (!pickUpIds.length) reject(new Error('miss pickUpIds'))
      Server({
        url: '/load/bill/batchPrint',
        method: 'post',
        data: { pickUpIds }
      }).then(res => {
        resolve(res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 查询运单车辆位置
  getPickupOrderLocation (store, pickUpIds) {
    return new Promise((resolve, reject) => {
      if (!pickUpIds.length) reject(new Error('miss pickUpIds'))
      Server({
        url: pickUpIds.length > 1 ? '/load/bill/location' : '/load/bill/single/location',
        method: 'post',
        data: pickUpIds.length > 1 ? ({ pickUpIds }) : ({ pickUpId: pickUpIds[0] })
      }).then(res => {
        resolve(res.data.data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 提货单提货校验
  pickupOrderCheck (store, pickUpId) {
    return new Promise((resolve, reject) => {
      if (!pickUpId) reject(new Error('miss pickUpId'))
      Server({
        url: '/load/bill/check/order',
        method: 'post',
        data: { pickUpId }
      }).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 提货单到货
  pickupOrderArrival (store, pickUpIds) {
    return new Promise((resolve, reject) => {
      if (!pickUpIds.length) reject(new Error('miss pickUpIds'))
      Server({
        url: '/load/bill/confirm/arrival',
        method: 'post',
        data: { pickUpIds }
      }).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  // 获取提货单列表tab count
  getPickupOrderTabCount ({ commit }) {
    Server({
      url: '/load/bill/tab/cnt',
      method: 'get'
    }).then(res => {
      commit(types.PICKUP_TAB_COUNT, setPickupTab(res.data.data))
    })
  }

}
