import Vue from 'vue'
import axios from 'axios'
import { LoadingBar, Message } from 'iview'
import { getToken } from './auth'

let reportData = {}

let instance = axios.create({
  baseURL: process.env.VUE_APP_HOST,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': getToken(),
    'Cache-Control': 'no-cache', // 解决ie浏览器缓存
    'Pragma': 'no-cache' // 解决ie浏览器缓存
  },
  withCredentials: true,
  loading: false,
  ignoreCode: false,
  ignoreReport: false // 是否忽略该请求耗时，不进行上报
})

// POST传参序列化
instance.interceptors.request.use((config) => {
  // 设置上报参数
  if (!config.ignoreReport) {
    // 防止同时产生多个请求，后面的请求覆盖前面的请求上报信息
    // 为当前上报生成一个随机名称，在上报完成后移除这一条上报信息
    config.reportName = Math.random().toString(32).substr(2, 10)
    reportData[config.reportName] = new Date().getTime()
  }

  // Loading判断
  config.loading && LoadingBar.start()
  if (config.method === 'post') {
    config.data = JSON.stringify(config.data)
  }
  if (config.method === 'get') {
    config.params = config.data || config.params || {}
    config.params._t = config.params._t || new Date().getTime()
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// code状态码200判断
instance.interceptors.response.use((res) => {
  // 上报接口耗时-ms
  if (!res.config.ignoreReport) {
    const name = res.config.reportName
    Vue.$ga.time({
      timingCategory: 'apiRequest',
      timingVar: res.config.url,
      timingValue: Number(new Date().getTime() - reportData[name])
    })
    delete reportData[name]
  }

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
    Message.error('网络信号差，请稍后重试')
  }
  if (error.response && error.response.status) {
    Message.error(error.response.statusText + ' ' + error.response.status)
  }
  Vue.$ga.exception(`msg: ${error.message} || url: ${reportData.url}`)
  return Promise.reject(error)
})

export default instance
