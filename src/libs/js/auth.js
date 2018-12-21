import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  // 有效期一年
  return Cookies.set(TokenKey, token, { expires: 365, path: '/' })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
