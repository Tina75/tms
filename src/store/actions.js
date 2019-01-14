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
  })
}

/** 获取消息数量 */
export const getMessageCount = ({ commit }) => {
  return Server({
    url: '/message/num',
    method: 'get'
  }).then(({ data }) => {
    commit('updateMsgCount', data.data)
  })
}

/** 获取自定义table列表信息 */
export const getTableColumns = ({ commit }) => {
  return Server({
    url: '/gridHead/list',
    method: 'get'
  }).then(({ data }) => {
    commit('initTableColumns', data.data)
  })
}

/** 获取自定义table列表信息 */
export const setDocumentHeight = ({ commit }, height) => {
  commit('updateDocumentHeight', height - 80 - 40)
}
/**
 * 获取订单开单配置
 * ! 废弃1.09；合并接口,关注函数：getConfiguration
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
 * 查询设置配置，合并接口1.09
 * 包含：短信配置，分摊策略，开单设置
 * @param {*} param0
 */
export const getConfiguration = ({ commit }) => {
  return Server({
    url: 'set/commonSettingInfo',
    method: 'get'
  }).then((result) => {
    if (result.data.code === 10000) {
      const { smsSetInfo, allocationStrategyInfo, tmsSetConfigDto, tmsCargoDto, tmsDispatchCarDto = {} } = result.data.data
      commit('smsSetting', smsSetInfo.smsCode)
      commit('allocationStrategySetting', allocationStrategyInfo)
      commit('changeOrderConfiguration', tmsSetConfigDto) // 开单设置
      commit('tmsCargoDtoSetting', tmsCargoDto)
      commit('changeDispatchConfiguration', tmsDispatchCarDto) // 派车设置
    }
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

/**
 * 司机手机号校验
 * @param Array
 */
export const checkDriverPhone = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    Server({
      url: process.env.VUE_APP_DRIVER + 'uc/phoneused',
      method: 'post',
      data: {
        phoneList: data
      }
    }).then(result => {
      resolve(result.data.data.checkResult)
    }).catch(err => {
      reject(err)
    })
  })
}
