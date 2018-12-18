import Cookies from 'js-cookie'

const TokenKey = 'tms_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  // 有效期一年
  return Cookies.set(TokenKey, token, { expires: 365 })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
