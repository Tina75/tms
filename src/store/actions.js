import Server from '@/libs/js/server'

/** 更新用户信息 */
export const getUserInfo = ({ rootState, commit, state, dispatch }, data) => {
  return commit('initUserInfo', data)
}

/** 获取用户权限 */
export const getPermissons = ({commit}, list) => {
  return Server({
    url: '/user/permission',
    method: 'get'
  }).then(({data}) => {
    commit('initPermissions', data.data)
  }).catch(e => {
    console.log(e)
  })
}
