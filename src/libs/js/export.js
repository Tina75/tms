import Server from './server'
import { Message } from 'iview'

let instance = (config = {}) => {
  Server(Object.assign({
    timeout: 10000,
    loading: true,
    ignoreCode: true,
    responseType: 'arraybuffer',
    fileName: '导出文件',
    fileType: 'application/x-xls'
  }, config)).then(res => {
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

      if (!code || code === 10000) {
        let blob = new Blob([res.data], { type: res.config.fileType })
        const url = window.URL || window.webkitURL || window.mozURL
        let downloadLink = document.createElement('a')
        downloadLink.href = url.createObjectURL(blob)
        downloadLink.download = res.config.fileName + new Date().Format('yyyy-MM-dd_hhmmss') + '.xls'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
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
  })
}

export default instance
