import server from '@/libs/js/server'
import { clearFileInput } from '@/libs/js/util'
const MAX_UPLOAD_FILES = 3
export default {
  props: {
    needUpdate: {
      type: Boolean,
      default: false
    },
    ossClient: Object,
    ossDir: String
  },
  data () {
    return {
      downloadUrl: '', // 模板下载地址
      dataSource: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      progress: 0,
      timer: null,
      queue: [] // 上传进度队列
    }
  },
  computed: {
    queueNum () {
      // 上传队列里的
      return this.queue.length
    },
    canUpload () {
      return MAX_UPLOAD_FILES > this.queueNum
    }
  },
  created () {
    this.getDownloadUrl()
  },
  mounted () {
    if (this.$refs.footer) {
      this.$refs.footer.parentElement.style['min-height'] = '180px'
      this.$refs.footer.parentElement.style['display'] = 'none'
    }
    this.fetch()
  },
  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  methods: {
    /**
     * 模板下载地址
     */
    getDownloadUrl () {
      // 获取导入模板下载地址
      server({
        method: 'get',
        url: this.templateRequestUrl
      }).then((response) => {
        this.downloadUrl = response.data.data.fileUrl
      })
    },
    /**
     * 清空导入记录了
     */
    clearAll () {
      const vm = this
      if (this.pagination.totalCount === 0) {
        this.$Message.info('当前没有可清空的导入记录')
        return
      }
      this.$Toast.confirm({
        content: '导入记录清空后将无法恢复',
        description: '清空记录不会删除已导入的订单数据。',
        onOk () {
          server({
            url: vm.clearAllRequestUrl,
            method: 'post',
            data: {}
          }).then((res) => {
            vm.fetch()
          })
        }
      })
    },
    /**
     * 单个删除记录
     */
    deleteById (data) {
      const vm = this
      this.$Toast.confirm({
        content: '导入记录删除后将无法恢复',
        description: '删除记录不会删除已导入的订单数据。',
        onOk () {
          server({
            url: vm.deleteOrderRequestUrl,
            method: 'post',
            data: {
              id: data.id
            }
          }).then((res) => {
            vm.fetch()
          })
        }
      })
    },
    /**
     * 下载完后回调
     */
    handleLoad (response) {
      if (!response.data.data || response.data.data.list.length === 0) {
        this.$refs.footer.parentElement.style['display'] = 'block'
      } else {
        this.$refs.footer.parentElement.style['display'] = 'none'
      }
    },
    // 主动触发上传
    handleClick (e) {
      this.$refs.fileInput.click()
    },
    /**
     * 定时轮询接口，查看进度
     */
    loopCheckFileProgress (importId) {
      const vm = this
      let timer = null
      // 塞入初始进度值
      vm.queue.push({ importId, percent: vm.rangeRandom(20) })

      function checkProgress () {
        try {
          timer = setTimeout(async () => {
            const res = await server({
              method: 'get',
              url: vm.importResultRequestUrl,
              data: {
                importId
              }
            })
            const { status } = res.data.data
            // status,1成功；0失败；2正在处理；3excel文件标题行非法
            if (status !== 2) {
              if (timer) {
                clearTimeout(timer)
              }
              if (status === 0) {
                vm.$Message.error('此次导入订单失败，具体失败原因下载错误报告')
              } else if (status === 3) {
                vm.$Message.error('上传文件缺少部分订单列，请重新下载模板')
              } else {
                vm.$Message.success(`导入成功，共导入${res.data.data.orderNum}条订单`)
              }
              vm.fetch()
              // 导入成功后，删除该条记录
              vm.$nextTick(() => {
                vm.queue = vm.queue.filter(item => item.importId !== importId)
              })
            } else {
              let { percent } = vm.queue.find(item => item.importId === importId)

              vm.updateProgress(importId, vm.rangeRandom(percent))
              checkProgress()
            }
          }, 2000)
        } catch (error) {
          if (timer) {
            clearTimeout(timer)
          }
          vm.visible = false
          vm.$Message.error({ content: error.data.msg, duration: 3 })
          return error
        }
      }

      checkProgress()
    },
    /**
     * 更新上传文件进度
     */
    updateProgress (id, percent) {
      const record = this.dataSource.find((item) => item.id === id)
      // 更新记录的进度
      if (record) {
        record.progress = percent
      }
      // 保存最新的进度
      const processItem = this.queue.find((item) => item.importId === id)
      if (processItem) {
        processItem.percent = percent
      }
    },
    /**
     * 随机范围值
     */
    rangeRandom (baseNumber = 20) {
      let percent = Math.floor(Math.random() * 20 + baseNumber)
      if (percent > 90) {
        percent = 99
      }
      return percent
    },
    /**
     * 文件上传后，回调
     */
    async handleChange (e) {
      const files = e.target.files

      if (!files || files.length === 0) {
        return false
      }
      if (!this.canUpload) {
        this.$Toast.warning({
          content: '最多只支持3个表格同时导入哦~'
        })
        return false
      }
      const file = files[0]
      if (file.name.length > 58) {
        this.$Message.warning('上传文件名长度请勿超过58位')
        clearFileInput(this.$refs.fileInput)
        return
      }
      try {
        const uploadResult = await this.uploadFile(file)
        let fileUrl = uploadResult.res.requestUrls[0]
        if (fileUrl.indexOf('?upload') !== -1) {
          fileUrl = fileUrl.substring(0, fileUrl.indexOf('?upload'))
        }
        const notifyResult = await this.notifyBackend(file.name, fileUrl)
        if (notifyResult.data.code === 10000) {
          // this.$Message.success({content: '导入文件完成，后台正在处理中，请稍后查看结果', duration: 3})
          // 20181113-mys 不显示弹窗，需要在进度条挂载表格里的导入结果列
          // this.visible = true
          // 刷新列表后查询进度
          this.fetch()
            .then((res) => {
              clearFileInput(this.$refs.fileInput)
              this.loopCheckFileProgress(notifyResult.data.data.id)
            })
        }
      } catch (error) {
        if (error.code === 'InvalidAccessKeyId' || error.code === 'InvalidBucketName') {
          // token失效过期了
          this.$Message.info({ content: '重新获取认证信息，文件正在上传', duration: 3 })
          await this.$parent.initOssInstance()
          this.handleChange(e)
        } else {
          // console.error('导入订单', error)
          this.$Message.error({ content: '导入订单文件失败', duration: 3 })
        }
      }
    },
    async uploadFile (file) {
      const vm = this
      if (this.ossClient) {
        try {
          // this.visible = true
          // 生成随机文件名 Math.floor(Math.random() *10000)
          let result = null
          let randomName = new Date().getTime() * Math.random() + '.' + file.name.split('.').pop()
          if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
            result = await this.ossClient.put(this.ossDir + randomName, file)
          } else {
            result = await this.ossClient.multipartUpload(this.ossDir + randomName, file, {
              partSize: 1024 * 1024, // 分片大小 ,1M
              progress: function (progress, pp) {
                if (progress) {
                  vm.progress = progress
                }
              }
            })
          }
          this.$nextTick(() => {
            // this.visible = false
            vm.progress = 0
          })
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
    },
    /**
     * 通知后端文件名称，
     * 文件上传成功，
     */
    async notifyBackend (fileName, fileUrl) {
      try {
        const vm = this
        const result = await server({
          method: 'post',
          url: vm.notifyRequestUrl,
          data: {
            fileName,
            fileUrl: decodeURI(fileUrl) // 中文转义回来
          }
        })
        return result
      } catch (error) {
        throw error
      }
    },
    handlePageChange (pageNo) {
      this.pagination.pageNo = pageNo
      this.fetch()
    },
    // pagesize变化
    handlePageSizeChange (pageSize) {
      if (!pageSize) {
        return
      }
      // 重新组装数据，生成查询参数
      this.pagination.pageNo = 1
      this.pagination.pageSize = pageSize
      this.fetch()
    },
    /**
     * 查询列表
     */
    fetch () {
      const vm = this
      return server({
        url: vm.importRecordsRequestUrl,
        method: 'post',
        data: {
          ...vm.pagination
        }
      }).then((res) => {
        const { list, ...pagination } = res.data.data
        vm.dataSource = list.map((item) => {
          if (item.status !== 1 && item.status !== 0) {
            item.progress = 0
          }
          return item
        })
        // Object.assign(vm.pagination, pagination)
        vm.pagination.pageSize = pagination.pageSize || 10
        vm.pagination.totalCount = pagination.totalCount
        vm.handleLoad(res)
        return res
      }).catch((error) => {
        vm.$refs.footer.parentElement.style['display'] = 'block'
        throw error
      })
    },
    /**
     * 标记用户已经过下载模板
     * @param {Number} source 1:订单；2：历史订单
     */
    userDownloadTemplate (source) {
      return server({
        url: 'order/template/recordDownload',
        method: 'post',
        data: {
          source
        }
      })
    }
  }
}
