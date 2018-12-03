import * as types from './mutationTypes'
import server from '@/libs/js/server'
export default {
  /**
   * 规则列表_根据修改时间倒序
   * @param {*} paramName
   * @param {*} partnerType 必填
   * @param {*} partnerId
   */
  getRules ({ state, commit }, data) {
    return new Promise((resolve, reject) => {
      server({
        url: '/finance/charge/listRules',
        method: 'get',
        params: data
      }).then((res) => {
        // 计费规则列表
        const ruleList = res.data.data
        commit(types.RECEIVE_RULE_LIST, ruleList)
        resolve(ruleList)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
