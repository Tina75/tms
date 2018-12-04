import * as types from './mutationTypes'
import server from '@/libs/js/server'
export default {
  /**
   * 规则列表_根据修改时间倒序
   * @param {*} paramName
   * @param {*} partnerType 必填  1: '发货方',2: '承运商',
   * @param {*} partnerId
   */
  getSenderRules ({ state, commit }) {
    return new Promise((resolve, reject) => {
      server({
        url: '/finance/charge/listRules',
        method: 'get',
        params: {
          partnerId: '',
          partnerType: 1,
          paramName: ''
        }
      }).then((res) => {
        // 发货方计费规则列表
        const ruleList = res.data.data
        commit(types.SENDER_RULE_LIST, ruleList)
        resolve(ruleList)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getCarriesRules ({ state, commit }) {
    return new Promise((resolve, reject) => {
      server({
        url: '/finance/charge/listRules',
        method: 'get',
        params: {
          partnerId: '',
          partnerType: 2,
          paramName: ''
        }
      }).then((res) => {
        // 承运商计费规则列表
        const ruleList = res.data.data
        commit(types.CARRIES_RULE_LIST, ruleList)
        resolve(ruleList)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
