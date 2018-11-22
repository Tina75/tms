<template>
  <div class="order-import">
    <div class="i-mb-10 ivu-upload">
      <Button v-if="hasPower(100201)" type="primary" @click="handleClick">导入订单</Button>
      <input
        ref="fileInput"
        name="file"
        type="file"
        class="ivu-upload-input"
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="handleChange"
      />
      <a v-if="hasPower(100202)" :href="downloadUrl" download="下载模板" class="i-ml-10 ivu-btn ivu-btn-default">下载模板</a>
      <Button class="i-ml-10" @click="clearAll">清空导入记录</Button>
    </div>
    <!-- <PageTable
      ref="pageTable"
      :columns="columns"
      :show-filter="false"
      url="order/template/getImportedOrderTemplateList"
      method="post"
      no-data-text=" "
      @on-load="handleLoad"
    >
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
    </PageTable> -->
    <Table :columns="columns" :data="dataSource" no-data-text=" ">
      <div ref="footer" slot="footer" class="order-import__empty-content van-center">
        <div class="order-import__empty-content-wrap">
          <div>
            <img src="../assets/empty-order.png"/>
            <div>您还没有导入订单，去下载模板导入订单吧！</div>
          </div>
          <div class="i-mt-10">
            <Button v-if="hasPower(100201)" type="primary" @click="handleClick">导入订单</Button>
          </div>
        </div>
      </div>
    </Table>
    <div v-if="pagination.totalCount !==0" class="order-import__footer-pagination">
      <div class="order-import__footer-pagination-fr">
        <Page
          :current="pagination.pageNo"
          :total="pagination.totalCount"
          :show-sizer="true"
          :page-size-opts="[10,20,50]"
          show-total
          size="small"
          class="order-import__pagination-bar"
          @on-change="handlePageChange"
          @on-page-size-change="handlePageSizeChange"
        >
        </Page>
      </div>
    </div>
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
import { Progress } from 'iview'

/**
 * 批量导入
 * 1.文件类型
 * 2.文件大小
 */
const MAX_UPLOAD_FILES = 3
export default {
  name: 'order-import',
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
      // visible: false,
      // totalCount: 0,
      dataSource: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      // progress: 0,
      ossClient: null,
      ossDir: '',
      timer: null,
      queue: [], // 上传进度队列
      columns: [
        {
          title: '操作',
          key: 'action',
          width: 160,
          render: (h, params) => {
            const actions = [
              h('a', {
                attrs: {
                  href: params.row.fileUrl,
                  download: '下载模板'
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
            // 添加删除操作
            actions.push(
              h('a', {
                class: 'i-ml-10',
                attrs: {
                  href: 'javascript:;'
                },
                on: {
                  click: () => {
                    vm.deleteById(params.row)
                  }
                }
              }, '删除')
            )
            return h('div', actions)
          }
        },
        {
          title: '导入时间',
          key: 'createTime',
          width: 150,
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
          width: 180,
          render: (h, params) => {
            if (params.row.status === 1) {
              return h('span', '导入成功')
            } else if (params.row.status === 0) {
              return h('span', {
                class: 'i-error'
              }, '导入失败')
            } else {
              return h(Progress, {
                props: {
                  strokeWidth: 6,
                  percent: params.row.progress || 0,
                  status: 'active'
                }
              })
            }
            // return h('span', '正在处理')
          }
        },
        {
          title: '成功导入订单数',
          key: 'orderCount',
          width: 120,
          render (h, params) {
            return h('span', {}, params.row['orderCount'] ? params.row['orderCount'] : 0)
          }
        },
        {
          title: '操作人',
          key: 'operatorName',
          width: 150
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['UserInfo']),
    queueNum () {
      // 上传队列里的
      return this.queue.length
    },
    canUpload () {
      return MAX_UPLOAD_FILES > this.queueNum
    }
  },
  created () {
    this.initOssInstance()
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
            url: '/order/template/clearOrderTemplateImportRecord',
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
            url: 'order/template/deleteOrderTemplateImportRecord',
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
     * 初始化oss
     */
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
    /**
     * 下载完后回调
     */
    handleLoad (response) {
      // response.data.msg !== 10000
      if (!response.data.data || response.data.data.list.length === 0) {
        // this.$refs.footer.parentElement.parentElement.style['display'] = 'block'
        this.$refs.footer.parentElement.style['display'] = 'block'
      } else {
        // this.$refs.footer.parentElement.parentElement.style['display'] = 'none'
        this.$refs.footer.parentElement.style['display'] = 'none'
        // this.totalCount = response.data.data.list.length
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
      vm.queue.push(importId)

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
            const { status, percent } = res.data.data
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
              // vm.visible = false
              vm.fetch()
              // 导入成功后，删除该条记录
              vm.$nextTick(() => {
                vm.queue = vm.queue.filter(id => id !== importId)
              })
            } else {
              // vm.queue[importId] = percent
              vm.updateProgress(importId, percent)
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
      if (record) {
        record.progress = percent
      }
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
        this.$refs.fileInput.value = null
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
              this.$refs.fileInput.value = null
              this.loopCheckFileProgress(notifyResult.data.data.id)
            })
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
        url: 'order/template/getImportedOrderTemplateList',
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
    }
  }
}
</script>

<style lang="stylus">
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
    &__footer-pagination
      margin: 10px;
      overflow: hidden;
      &-fr
        float: right;
    &__pagination-bar
    .ivu-page-item-active
      background-color: #00A4BD
      border-radius: 4px
      a
        color: #fff
</style>
