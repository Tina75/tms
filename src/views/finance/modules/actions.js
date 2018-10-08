import * as types from './mutationTypes'
import axios from '@/libs/js/server'

/** 公司查询条件 */
export const setAccountQuery = ({ rootState, commit, state, dispatch }, data) => {
  return new Promise((resolve, reject) => {
    commit(types.SET_ACCOUNT_QUERY, data)
    resolve()
  })
}

/** 公司列表 */
export const getAccountList = ({ rootState, commit, state, dispatch }) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: 'company/list',
      data: Object.assign({}, rootState.account.accountQuerySave, {
        beginTime: rootState.account.accountQuerySave.beginTime ? rootState.account.accountQuerySave.beginTime.getTime() : '',
        endTime: rootState.account.accountQuerySave.endTime ? (rootState.account.accountQuerySave.endTime.getTime() + 86400000) : ''
      })
    }).then((response) => {
      commit(types.SET_ACCOUNT_DATA, Object.assign({}, response.data.data, {
        list: response.data.data.list.map(item => {
          return Object.assign(item, {
            createTimeText: item.createTime ? new Date(parseInt(item.createTime)).Format('yyyy-MM-dd hh:mm') : '',
            expirationTimeText: item.expirationTime ? new Date(parseInt(item.expirationTime)).Format('yyyy-MM-dd hh:mm') : '',
            expUpdateTimeText: item.expUpdateTime ? new Date(parseInt(item.expUpdateTime)).Format('yyyy-MM-dd hh:mm') : '',
            statusText: rootState.account.communicateStatusMap[item.status]
          })
        })
      }))
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}

/** 开通正式版 */
export const accountUpgrade = ({ rootState, commit, state, dispatch }, id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: 'company/vip',
      data: {
        companyId: id
      }
    }).then((response) => {
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}

/** 获取公司详情 */
export const getAccountDetail = ({ rootState, commit, state, dispatch }) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: 'company/detail',
      data: {
        id: rootState.route.params.id
      }
    }).then((response) => {
      commit(types.SET_ACCOUNT_DETAIL, response.data.data)
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}

/** 添加沟通记录 */
export const addCommunicateLog = ({ rootState, commit, state, dispatch }, content) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: 'company/addRecord',
      data: {
        companyId: rootState.route.params.id,
        talkContent: content
      }
    }).then((response) => {
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}

/** 修改公司信息 */
export const editAccount = ({ rootState, commit, state, dispatch }, pic) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: 'company/update',
      data: {
        companyId: rootState.route.params.id,
        fileUrl: pic
      }
    }).then((response) => {
      resolve(response)
    }).catch((error) => {
      reject(error)
    })
  })
}
