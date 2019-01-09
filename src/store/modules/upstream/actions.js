import * as types from './mutationTypes'
import Server from '@/libs/js/server'
export default {
  getCount ({ state, commit }) {
    return new Promise((resolve, reject) => {
      Server({
        url: '/busconnector/shipper/getOrderNumByStatus',
        method: 'get'
      }).then(res => {
        commit(types.WAITACCEPT, Number(res.data.data.waitAccept))
        resolve(res.data.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
