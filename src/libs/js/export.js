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
        console.log('resJson', resJson)
      } catch (err) {}

      if (!code || code === 10000) {
        let blob = new Blob([res.data], { type: res.config.fileType })
        const url = window.URL || window.webkitURL || window.mozURL
        const downloadHref = url.createObjectURL(blob)
        const downloadName = res.config.fileName + new Date().Format('yyyy-MM-dd_hhmmss') + '.xls'

        // 正常blob下载链接形式为 blob:http://host/xxxx
        // IE或旧版本Edge为 blob:xxxx 会导致无法下载，使用 navigator.msSaveOrOpenBlob 进行下载
        if (downloadHref.indexOf(window.location.host) === -1) {
          window.navigator.msSaveOrOpenBlob(blob, downloadName)
        } else {
          let downloadLink = document.createElement('a')
          downloadLink.href = downloadHref
          downloadLink.download = downloadName
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
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
