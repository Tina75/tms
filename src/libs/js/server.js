import axios from 'axios'
import { LoadingBar, Message } from 'iview'

function getToken () {
  let temp = document.cookie.match(new RegExp('(^| )token=([^;]*)(;|$)'))
  if (temp) return unescape(temp[2])
}

let instance = axios.create({
  baseURL: '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': getToken()
  },
  withCredentials: true,
  loading: false,
  ignoreCode: process.env.NODE_ENV === 'development'
})

switch (process.env.NODE_ENV) {
  case 'development':
    instance.defaults.baseURL = '/'; break
  case 'production':
    instance.defaults.baseURL = '//dev-boss.yundada56.com/bluewhale-boss/'; break
}

// POST传参序列化
instance.interceptors.request.use((config) => {
  // Loading判断
  config.loading && LoadingBar.start()
  if (config.method === 'post') {
    config.data = JSON.stringify(config.data)
  }
  if (config.method === 'get' && config.data) {
    config.params = config.data
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// code状态码200判断
instance.interceptors.response.use((res) => {
  LoadingBar.finish()
  var code = Number(res.data.code)
  if (!res.config.ignoreCode || code === 10000) {
    return res
  } else {
    switch (code) {
      case 280102:// token失效或不存在
      case 280103:// 账号在其他设备登录
      case 280104:// 认证校验不通过
      case 280105:// 客户端头信息缺失
      case 280106:// 用户不存在
        Message.error(`${res.data.msg}`)
        window.EMA.fire('logout')
        break
      default:
        Message.error(res.data.msg)
        break
    }
    return Promise.reject(res)
  }
}, (error) => {
  if (error.message.indexOf('timeout') !== -1) {
    Message.error('接口超时')
  }
  return Promise.reject(error)
})

export default instance
