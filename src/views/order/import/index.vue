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
      <Button v-if="hasPower(100202)" :to="downloadUrl" class="i-ml-10" target="_blank">下载模板</Button>
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
    <!-- <Modal
      :value="visible"
      :closable="false"
      :mask-closable="false"
      title="文件正在努力上传.."
    >
      <div class="van-center">
        <i-circle :percent="progress">
          <span style="font-size:24px">{{progress}}%</span>
        </i-circle>
      </div>
      <div slot="footer"></div>
    </Modal> -->
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
      columns: [
        {
          title: '导入日期',
          key: 'createTime',
          render (h, params) {
            let time = params.row.createTime
            return time ? h('span', new Date(time).Format('yyyy-MM-dd hh:mm:ss')) : ''
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
            return h('span', params.row.status === 1 ? '导入成功' : '导入失败')
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
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            const actions = [
              h('a', {
                attrs: {
                  href: params.row.fileUrl
                }
              }, '下载')
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
                  // vm.openTab({
                  //   title: '订单管理',
                  //   path: '/order-management/order',
                  //   query: {
                  //     id: params.row.id
                  //   }
                  // })
                    jsCookie.set('imported_id', params.row.id, {expires: 1})
                    vm.$router.push({path: '/order-management/order', query: {title: '订单管理'}})
                  }
                }
              }, '查看导入订单'))
            }
            return h('div', actions)
          }
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
  methods: {
    initOssInstance () {
      const vm = this
      /**
       * 后端获取阿里云access token, region 参数
       * 初始化oss client，用户上传模板前需要准备好
       */
      server({
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
          vm.ossClient = new OssClient({
            accessKeyId: data.ossTokenDTO.stsAccessId,
            accessKeySecret: data.ossTokenDTO.stsAccessKey,
            stsToken: data.ossTokenDTO.stsToken,
            bucket: data.ossTokenDTO.bucketName,
            endpoint: data.ossTokenDTO.endpoint
          })
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
    /**
     * 文件上传后，回调
     */
    async handleChange (e) {
      const files = e.target.files

      if (!files || files.length === 0) {
        return false
      }
      try {
        const uploadResult = await this.uploadFile(files[0])
        const notifyResult = await this.notifyBackend(files[0].name, uploadResult.res.requestUrls[0])
        if (notifyResult.data.code === 10000) {
          this.$Message.success('导入文件成功')
        }
      } catch (error) {
        console.error('导入订单', error)
      }

      this.$refs.pageTable.fetch()
      this.$refs.fileInput.value = null
    },
    async uploadFile (file) {
      if (this.ossClient) {
        try {
          // this.visible = true
          // 生成随机文件名 Math.floor(Math.random() *10000)
          let randomName = file.name + new Date().Format('yyyyMMddhhmm') + '.' + file.name.split('.').pop()
          let result = await this.ossClient.multipartUpload(randomName, file, {
            partSize: 1024 * 1024, // 分片大小 ,1M
            progress: function (progress, pp) {
              console.log('progress', progress)
              if (progress) {
                this.progress = progress
              }
            }
          })
          this.$nextTick(() => {
            // this.visible = false
            this.progress = 0
          })
          return result
        } catch (e) {
          // 捕获超时异常
          if (e.code === 'ConnectionTimeoutError') {
            this.$Message.error('文件上传超时')
            // do ConnectionTimeoutError operation
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
            fileUrl
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
            console.log('fetch')
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
