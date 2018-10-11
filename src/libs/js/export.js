import axios from 'axios'
import Server from './server'
import Cookies from 'js-cookie'
import { LoadingBar, Message } from 'iview'

let fileName = ''

let instance = axios.create({
  baseURL: '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': Cookies.get('token')
  },
  withCredentials: true,
  loading: false,
  ignoreCode: false,
  responseType: 'arraybuffer' // 'application/json'
})

instance.defaults.baseURL = Server.defaults.baseURL

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
  fileName = config.fileName
  return config
}, (error) => {
  return Promise.reject(error)
})

// code状态码200判断
instance.interceptors.response.use((res) => {
  LoadingBar.finish()
  console.log(res)
  const tempBlob = new Blob([res.data], { type: 'application/json' })
  const reader = new FileReader()
  reader.onload = e => {
    let code
    let msg
    const resStr = e.target.result

    try {
      const resJson = JSON.parse(resStr)
      if (resJson && resJson.code) {
        code = resJson.code
        msg = resJson.msg
      }
    } catch (err) {}

    if (!code) {
      let blob = new Blob([res.data], { type: 'application/x-xls' })
      let downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(blob)
      downloadLink.download = fileName + new Date().Format('yyyy-MM-dd_hhmmss') + '.xls'
      downloadLink.click()
      Message.success('导出成功')
    } else {
      switch (code) {
        case 310010:// token失效或不存在
        case 310011:// 账号在其他设备登录
          window.EMA.fire('logout')
          break
        case 210014:
        case 600002:// 无权限
          Message.error(`${msg},请刷新页面`)
          window.EMA.fire('refresh')
          break
        default:
          Message.error(msg)
          break
      }
    }
  }
  reader.readAsText(tempBlob)
}, (error) => {
  if (error.message.indexOf('timeout') !== -1) {
    Message.error('接口超时')
  }
  return Promise.reject(error)
})

export default instance
