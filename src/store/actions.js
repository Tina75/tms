import Server from '@/libs/js/server'
import { removeToken } from '../libs/js/auth'
/** 更新用户信息 */
export const getUserInfo = ({ rootState, commit, state, dispatch }, data) => {
  return Server({
    url: '/set/userInfo',
    method: 'get'
  }).then(({ data }) => {
    // 20181214 接口返回值包含权限
    const { permission, ...userInfo } = data.data
    commit('initUserInfo', userInfo)
    commit('initPermissions', permission || [])
    return data.data
  }).catch(e => {
    console.log(e)
    return Promise.reject(e)
  })
}

/** 更新用户信息 */
export const getCompanyInfo = ({ rootState, commit, state, dispatch }, data) => {
  return Server({
    url: '/set/companyInfo',
    method: 'get'
  }).then(({ data }) => {
    commit('initUserInfo', data.data)
  }).catch(e => {
    console.log(e)
  })
}
/**
 * 获取用户权限
 * !! 废弃 20181214-合并到获取用户信息接口里
 */
export const getPermissons = ({ commit }, list) => {
  return Server({
    url: '/user/permission',
    method: 'get'
  }).then(({ data }) => {
    commit('initPermissions', data.data)
  }).catch(e => {
    console.log(e)
  })
}

/** 获取消息数量 */
export const getMessageCount = ({ commit }) => {
  return Server({
    url: '/message/num',
    method: 'get'
  }).then(({ data }) => {
    commit('updateMsgCount', data.data)
  }).catch(e => {
    console.log(e)
  })
}

/** 获取自定义table列表信息 */
export const getTableColumns = ({ commit }) => {
  return Server({
    url: '/gridHead/list',
    method: 'get'
  }).then(({ data }) => {
    commit('initTableColumns', data.data)
  }).catch(e => {
    console.log(e)
  })
}

/** 获取自定义table列表信息 */
export const setDocumentHeight = ({ commit }, height) => {
  commit('updateDocumentHeight', height - 80)
}
/**
 * 获取订单开单配置
 * @param {} param0
 */
export const getOrderConfiguration = ({ commit }) => {
  return Server({
    url: 'order/config/get',
    method: 'post',
    data: {}
  }).then(({ data }) => {
    // commit('changeOrderConfiguration', data.data.weightOption)
  })
}
/**
 * 登出
 * @param {} param0
 */
export const logout = ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit('initUserInfo', {})
    commit('initPermissions', [])
    // 记住密码
    const localRememberdPW = window.localStorage.local_rememberd_pw
    localStorage.clear()
    if (localRememberdPW) {
      window.localStorage.setItem('local_rememberd_pw', localRememberdPW)
    }
    removeToken()
    resolve()
  })
}
