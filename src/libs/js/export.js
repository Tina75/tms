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
  ignoreCode: false,
  responseType: 'arraybuffer' // 'application/json'
})

switch (process.env.NODE_ENV) {
  case 'development':
    instance.defaults.baseURL = 'http://192.168.1.49:5656/dolphin-web/'; break
  case 'production':
    instance.defaults.baseURL = '//192.168.1.49:5656/dolphin-web/'; break
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
  // console.log(String.fromCharCode.apply(null, new Uint8Array(res.data)))
  if (res.data instanceof ArrayBuffer) {
    let blob = new Blob([res.data], { type: 'application/x-xls' })
    let downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = '订单明细' + new Date().Format('yyyy-MM-dd') + '.xls'
    downloadLink.click()
  } else {
    const code = res.data.code
    switch (code) {
      case 310010:// token失效或不存在
      case 310011:// 账号在其他设备登录
        window.EMA.fire('logout')
        break
      case 210014:
      case 600002:// 无权限
        Message.error(`${res.data.msg},请刷新页面`)
        window.EMA.fire('refresh')
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
