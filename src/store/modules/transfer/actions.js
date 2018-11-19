import * as types from './mutationTypes'
import server from '@/libs/js/server'
export default {
  /**
   * 外转方列表_按照更新时间倒序
   * @param {*} type 1 外转方名称  2 负责人
   * @param {*} keyword
   */
  getTransferees ({ state, commit }) {
    return new Promise((resolve, reject) => {
      // const { pageNo, pageSize } = state.order.pagination
      server({
        method: 'get',
        url: 'transferee/listOrderbyUpdateTimeDesc',
        params: {
          // pageNo: pageNo,
          // pageSize: pageSize,
          type: 1,
          keyword: null
        }
      }).then((response) => {
        // 外转方信息
        const transferees = response.data.data.list
        commit(types.RECEIVE_TRANSFEREE_LIST, transferees)
        resolve(transferees)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
