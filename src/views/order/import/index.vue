<template>
  <div class="order-import">
    <div class="i-mb-10 ivu-upload">
      <!-- <Upload
        ref="uploader"
        :format="['xlsx','xls']"
        :show-upload-list="false"
        :with-credentials="true"
        :on-success="handleSuccess"
        :on-error="handleError"
        name="file"
        action="//yapi.yundada56.com/mock/214/order/template/import"
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        style="display:inline-block">
        <Button type="primary">导入文件</Button>
      </Upload> -->
      <Button v-if="hasPower(100201)" type="primary" @click="handleClick">导入文件</Button>
      <input
        ref="fileInput"
        name="file"
        type="file"
        class="ivu-upload-input"
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="handleChange"
      />
      <Button v-if="hasPower(100202)" :to="downloadUrl" download="下载模板" class="i-ml-10" target="_blank">下载模板</Button>
    </div>
    <PageTable ref="pageTable" :columns="columns" :show-filter="false" url="order/template/getImportedOrderTemplateList" method="post" no-data-text=" " @on-load="handleLoad">
      <div ref="footer" slot="footer" class="order-import__empty-content van-center">
        <div class="order-import__empty-content-wrap">
          <div>
            <img src="../assets/empty-order.png" />
            <div>您还没有导入订单，去下载模板导入订单吧！</div>
          </div>
          <div class="i-mt-10">
            <Button v-if="hasPower(100201)" type="primary" @click="handleClick">导入文件</Button>
          </div>
        </div>
      </div>
    </PageTable>
    <Modal
      :value="visible"
      :closable="false"
      :mask-closable="false"
      title="导入订单结果"
    >
      <Row>
        <Col span="24" class="van-center i-mt-10">
        <Spin fix>
        </Spin>
      </Col>
      </Row>
      <Row>
        <Col span="24" class="van-center i-primary i-mt-10">
        <span>导入订单正在紧急处理中..</span>
        </Col>
      </Row>

      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OssClient from 'ali-oss'
import PageTable from '@/components/page-table/index'
import BaseComponent from '@/basic/BaseComponent'
import BasePage from '@/basic/BasePage'
import server from '@/libs/js/server'
import jsCookie from 'js-cookie'
import TMSUrl from '@/libs/constant/url.js'
/**
 * 批量导入
 * 1.文件类型
 * 2.文件大小
 */
export default {
  metaInfo: {
    title: '批量导入'
  },
  components: {
    PageTable
  },
  mixins: [BaseComponent, BasePage],
  data () {
    const vm = this
    return {
      downloadUrl: '',
      visible: false,
      progress: 0,
      ossClient: null,
      ossDir: '',
      timer: null,
      columns: [
        {
          title: '操作',
          key: 'action',
          width: 160,
          render: (h, params) => {
            const actions = [
              h('a', {
                attrs: {
                  href: params.row.fileUrl
                }
              }, params.row.status ? '下载' : '下载错误报告')
            ]
            // 导入成功可以看下载
            if (params.row.status === 1) {
              actions.push(h('a', {
                class: 'i-ml-10',
                attrs: {
                  href: 'javascript:;'
                },
                on: {
                  click: () => {
                    jsCookie.set('imported_id', params.row.id, { expires: 1 })
                    vm.openTab({
                      title: '订单管理',
                      path: TMSUrl.ORDER_MANAGEMENT
                    })
                    // vm.$router.push({path: '/order-management/order', query: {title: '订单管理'}})
                  }
                }
              }, '查看导入订单'))
            }
            return h('div', actions)
          }
        },
        {
          title: '导入日期',
          key: 'createTime',
          render (h, params) {
            let time = params.row.createTime
            return time ? h('span', new Date(time).Format('yyyy-MM-dd hh:mm:ss')) : h('span', '-')
          }
        },
        {
          title: '导入文件名',
          key: 'fileName'
        },
        {
          title: '导入结果',
          key: 'status',
          width: 100,
          render: (h, params) => {
            if (params.row.status === 1) {
              return h('span', '导入成功')
            } else if (params.row.status === 0) {
              return h('span', {
                class: 'i-error'
              }, '导入失败')
            }
            return h('span', '正在处理')
          }
        },
        {
          title: '导入订单数',
          key: 'orderCount',
          width: 100
        },
        {
          title: '操作人',
          key: 'operatorName',
          width: 120
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['UserInfo'])
  },
  created () {
    this.initOssInstance()
    this.getDownloadUrl()
  },
  mounted () {
    if (this.$refs.footer) {
      this.$refs.footer.parentElement.parentElement.style['min-height'] = '180px'
      this.$refs.footer.parentElement.parentElement.style['display'] = 'none'
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  methods: {
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
          fileSuffix: 'xlsx'
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
    },
    /**
     * 模板下载地址
     */
    getDownloadUrl () {
      // 获取导入模板下载地址
      server({
        method: 'get',
        url: 'order/template/get'
      }).then((response) => {
        this.downloadUrl = response.data.data.fileUrl
      })
    },
    handleLoad (response) {
      // response.data.msg !== 10000
      if (!response.data.data || response.data.data.list.length === 0) {
        this.$refs.footer.parentElement.parentElement.style['display'] = 'block'
      } else {
        this.$refs.footer.parentElement.parentElement.style['display'] = 'none'
      }
    },
    // 主动触发上传
    handleClick (e) {
      this.$refs.fileInput.click()
    },
    loopCheckFileProgress (importId) {
      const vm = this
      let timer = null
      function checkProgress () {
        try {
          timer = setTimeout(async () => {
            const res = await server({
              method: 'get',
              url: 'order/getImportResult',
              data: {
                importId
              }
            })
            const status = res.data.data.status
            if (status === 1 || status === 0) {
              if (timer) {
                clearTimeout(timer)
              }
              if (status === 0) {
                vm.$Message.error({ content: `此次导入订单失败，具体失败原因下载错误报告`, duration: 3 })
              } else {
                vm.$Message.success({ content: `导入成功，共导入${res.data.data.orderNum}条订单`, duration: 3 })
              }
              vm.visible = false
              vm.$refs.pageTable.fetch()
            } else {
              checkProgress()
            }
          }, 3000)
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
     * 文件上传后，回调
     */
    async handleChange (e) {
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
      try {
        const uploadResult = await this.uploadFile(file)
        const notifyResult = await this.notifyBackend(file.name, uploadResult.res.requestUrls[0])
        if (notifyResult.data.code === 10000) {
          // this.$Message.success({content: '导入文件完成，后台正在处理中，请稍后查看结果', duration: 3})
          this.visible = true
          this.loopCheckFileProgress(notifyResult.data.data.id)
        }
      } catch (error) {
        if (error.code === 'InvalidAccessKeyId' || error.code === 'InvalidBucketName') {
          // token失效过期了
          this.$Message.info({ content: '重新获取认证信息，文件正在上传', duration: 3 })
          await this.initOssInstance()
          this.handleChange(e)
        } else {
          // console.error('导入订单', error)
          this.$Message.error({ content: '导入订单文件失败', duration: 3 })
        }
      }

      this.$refs.pageTable.fetch()
      this.$refs.fileInput.value = null
    },
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
            vm.progress = 0
          })
          return result
        } catch (e) {
          // 捕获超时异常
          if (e.code === 'ConnectionTimeoutError') {
            this.$Message.error('文件上传超时')
            // do ConnectionTimeoutError operation
          } else if (e.code === 'RequestError') {
            console.error('请求body格式非法')
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
        const result = await server({
          method: 'post',
          url: 'order/template/uploadNotify',
          data: {
            fileName,
            fileUrl: decodeURI(fileUrl) // 中文转义回来
          }
        })
        return result
      } catch (error) {
        // vm.$refs.pageTable.fetch()
        throw error
      }
    },
    // !废弃，暂时不用
    handleSuccess (res, file) {
      // const vm = this
      if (res.code === 1000) {
        this.$Message.success('导入成功')
      }
    },
    // !废弃，暂时不用
    handleError (errorInfo, file, fileList) {
      const vm = this
      this.openDialog({
        name: 'order/import/ErrorDialog.vue',
        data: {
          value: 0,
          download: 'javascript:;'
        },
        methods: {
          ok () {
            vm.$refs.pageTable.fetch()
          }
        }
      })
      // this.$Message.error('上传文件失败')
    }
  }
}
</script>

<style lang="stylus" scoped>
.order-import
  &__empty-content
    margin 0
    min-height 120px
    position relative
    &-wrap
      display block
      width 100%
      position absolute
      background-color #fff
      line-height 28px
      top -20px
</style>
