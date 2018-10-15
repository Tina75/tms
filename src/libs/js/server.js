import axios from 'axios'
import { LoadingBar, Message } from 'iview'
import Cookies from 'js-cookie'

let instance = axios.create({
  baseURL: process.env.VUE_APP_HOST,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
  },
  withCredentials: true,
  loading: false,
  ignoreCode: false
})

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
  if (res.config.responseType === 'arraybuffer') return res

  var code = Number(res.data.code)
  if (res.config.ignoreCode || code === 10000) {
    return res
  } else {
    switch (code) {
      case 310010:// token失效或不存在
      case 310011:// 账号在其他设备登录
        window.EMA.fire('logout', `${res.data.msg}`)
        break
      case 210014:
      case 600002:// 无权限
        Message.error(`${res.data.msg},请刷新页面`)
        window.EMA.fire('refresh')
        break
      // case 310013:// 手机号已注册走10000流程
      //   return res
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
  if (error.response && error.response.status) {
    Message.error(error.response.statusText + ' ' + error.response.status)
  }
  return Promise.reject(error)
})

export default instance
