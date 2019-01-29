import AliOss from 'ali-oss'
import server from './server'
/**
 * 阿里云上传文件客户端
 * 目前服务端token设置的是3600秒=1个小时
 *
 * 遇到的问题：
 * 1. 上传图片，批量导入订单，批量导入收货人等模块未统一上传函数
 * 2. 避免多次重复请求接口获取token，需要根据有效时间去触发请求获取token，避免资源浪费
 *
 * 这里统一上传aliyun函数
 * token需要每隔一个小时需要重新获取一次
 */
// 最后一次请求时间
let lastRequestTime = null
// 间隔1个小时请求一次
const intervalTime = 3600
// 阿里云实例
class OssClient {
  /**
   * 构造函数
   * @param {object} options 获取token的参数选项
   * @param {*} onProgress 进度回调函数
   */
  constructor (options = {
    bizType: 'order',
    fileCount: 1,
    fileSuffix: 'jpg'
  }, onProgress) {
    this.options = options
    this.ossDir = null
    this.ossClient = null
    if (onProgress) {
      this.onProgress = onProgress
    }
    if (!lastRequestTime) {
      // 初始化请求
      lastRequestTime = Date.now()
      this.getOssClient()
    } else {
      let now = Date.now()
      // 间隔的秒数
      let interval = Math.ceil((now - lastRequestTime) / 1000)
      if (interval >= intervalTime) {
        lastRequestTime = now
        this.getOssClient()
      }
    }
  }
  /**
   * 进度跟踪
   */
  onProgress (progress) {

  }
  /**
   * 获取osstoken
   * 1. 设置目录
   * 2. 设置客户端
   */
  getOssClient () {
    const vm = this
    return server({
      method: 'post',
      url: 'file/prepareUpload',
      data: vm.options
    })
      .then((response) => {
        const { data } = response.data
        vm.ossDir = data.ossKeys[0]
        vm.ossClient = new AliOss({
          accessKeyId: data.ossTokenDTO.stsAccessId,
          accessKeySecret: data.ossTokenDTO.stsAccessKey,
          stsToken: data.ossTokenDTO.stsToken,
          bucket: data.ossTokenDTO.bucketName,
          endpoint: data.ossTokenDTO.endpoint
        })
        return response
      })
  }
  /**
   * file对象
   * @param {File} file
   */
  async uploadFile (file) {
    const vm = this
    if (this.ossClient) {
      try {
        // this.visible = true
        // 生成随机文件名 Math.floor(Math.random() *10000)
        let result = null
        let randomName = new Date().getTime() * Math.random() + '.' + file.name.split('.').pop()
        if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
          result = await vm.ossClient.put(vm.ossDir + randomName, file)
        } else {
          result = await vm.ossClient.multipartUpload(vm.ossDir + randomName, file, {
            partSize: 1024 * 1024, // 分片大小 ,1M
            progress: vm.onProgress
          })
        }
        return result
      } catch (e) {
        // 捕获超时异常
        if (e.code === 'ConnectionTimeoutError') {
          this.$Message.error('文件上传超时')
          // do ConnectionTimeoutError operation
        } else if (e.code === 'RequestError') {
          // console.error('请求body格式非法')
        }
        throw e
      }
    }
  }
}

export default OssClient
