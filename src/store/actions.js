import Server from '@/libs/js/server'

/** 更新用户信息 */
export const getUserInfo = ({ rootState, commit, state, dispatch }, data) => {
  return Server({
    url: '/set/userInfo',
    method: 'get'
  }).then(({data}) => {
    commit('initUserInfo', data.data)
  }).catch(e => {
    console.log(e)
  })
}

/** 更新用户信息 */
export const getCompanyInfo = ({ rootState, commit, state, dispatch }, data) => {
  return Server({
    url: '/set/companyInfo',
    method: 'get'
  }).then(({data}) => {
    commit('initUserInfo', data.data)
  }).catch(e => {
    console.log(e)
  })
}
/** 获取用户权限 */
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
