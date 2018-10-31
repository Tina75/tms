import server from '@/libs/js/server'
import OssClient from 'ali-oss'
export default class Upload {
  /**
   *
   * @param {Object} props
   */
  constructor (props) {
    this.ossClient = null
    this.ossDir = ''
    this.progress = 0
    this.uploadImg = ''
    this.visible = false
    if (props) {
      this.maxSize = props.maxSize
      this.multiple = props.multiple
    }
  }

  initOssInstance () {
    const vm = this
    /**
     * 后端获取阿里云access token, region 参数
     * 初始化oss client，用户上传模板前需要准备好
     */
    return server({
      method: 'post',
      url: 'file/prepareUpload',
      data: {
        bizType: 'order',
        fileCount: 1,
        fileSuffix: 'jpg'
      }
    })
      .then((response) => {
        const { data } = response.data
        vm.ossDir = data.ossKeys[0]
        vm.ossClient = new OssClient({
          accessKeyId: data.ossTokenDTO.stsAccessId,
          accessKeySecret: data.ossTokenDTO.stsAccessKey,
          stsToken: data.ossTokenDTO.stsToken,
          bucket: data.ossTokenDTO.bucketName,
          endpoint: data.ossTokenDTO.endpoint
        })
        return response
      })
  }

  async doUpload (e) {
    const files = e.target.files
    if (!files || files.length === 0) {
      return false
    }
    const file = files[0]
    if (file.name.length > 58) {
      this.$Message.warning('上传文件名长度请勿超过58位')
      this.$refs.fileInput.value = null
      return
    }
    console.log(file)
    if (file.size > this.maxSize * 1024 * 1024) {
      this.$Message.warning(`图片大小不能超过${this.maxSize}M`)
      this.$refs.fileInput.value = null
      return
    }
    try {
      const uploadResult = await this.uploadFile(file)
      console.log(uploadResult.res.requestUrls[0])
      this.uploadImg = uploadResult.res.requestUrls[0]
      this.$Message.success({ content: '上传成功', duration: 3 })
    } catch (error) {
      if (error.code === 'InvalidAccessKeyId' || error.code === 'InvalidBucketName') {
        // token失效过期了
        this.$Message.info({ content: '重新获取认证信息，正在上传', duration: 3 })
        await this.initOssInstance()
        this.doUpload(e)
      } else {
        // console.error('导入订单', error)
        this.$Message.error({ content: '上传图片失败', duration: 3 })
      }
    }
    this.$refs.fileInput.value = null
  }

  async uploadFile (file) {
    const vm = this
    if (this.ossClient) {
      try {
        // this.visible = true
        // 生成随机文件名 Math.floor(Math.random() *10000)
        let randomName = file.name.split('.')[0] + new Date().Format('yyyyMMddhhmmss') + '.' + file.name.split('.').pop()
        let result = await this.ossClient.multipartUpload(this.ossDir + randomName, file, {
          partSize: 1024 * 1024, // 分片大小 ,1M
          progress: function (progress, pp) {
            if (progress) {
              vm.progress = progress
            }
          }
        })
        this.$nextTick(() => {
          // this.visible = false
          vm.progress = 1
        })
        return result
      } catch (e) {
        // 捕获超时异常
        if (e.code === 'ConnectionTimeoutError') {
          this.$Message.error('图片上传超时')
          // do ConnectionTimeoutError operation
        } else if (e.code === 'RequestError') {
          console.error('请求body格式非法')
        }
        throw e
      }
    }
  }

  handleView (name) {
    this.visible = true
  }
}
