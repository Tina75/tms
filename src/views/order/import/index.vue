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
      <Button type="primary" @click="handleClick">导入文件</Button>
      <input
        ref="fileInput"
        name="file"
        type="file"
        class="ivu-upload-input"
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="handleChange"
      />
      <Button :to="downloadUrl" class="i-ml-10" target="_blank">下载模板</Button>
    </div>
    <Input v-model="keywords.name"></Input>
    <PageTable ref="pageTable" :keywords="keywords" :columns="columns" :show-filter="false" url="order/template/getImportedOrderTemplateList" no-data-text=" " @on-load="handleLoad">
      <div ref="footer" slot="footer" class="order-import__empty-content van-center">
        <div class="order-import__empty-content-wrap">
          <div>
            <img src="../assets/empty-order.png" />
            <div>您还没有导入订单，去下载模板导入订单吧！</div>
          </div>
          <div class="i-mt-10">
            <Button type="primary" @click="handleClick">导入文件</Button>
          </div>
        </div>
      </div>
    </PageTable>
    <Modal
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
    </Modal>
  </div>
</template>

<script>
import OssClient from 'ali-oss'
import PageTable from '@/components/page-table/index'
import BaseComponent from '@/basic/BaseComponent'
import BasePage from '@/basic/BasePage'
import server from '@/libs/js/server'
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
    return {
      downloadUrl: '',
      visible: false,
      progress: 0,
      ossClient: null,
      keywords: {
        name: ''
      },
      columns: [
        {
          title: '导入日期',
          key: 'createTime'
        },
        {
          title: '导入文件名',
          key: 'fileName'
        },
        {
          title: '导入结果',
          key: 'status'
        },
        {
          title: '导入订单数',
          key: 'orderCount'
        },
        {
          title: '操作人',
          key: 'operator'
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('a', {
                href: 'params.column.fileUrl'
              }, '下载'),
              h('a', {
                href: 'javascript:;',
                class: 'i-ml-10'
              }, '查看订单')
            ])
          }
        }
      ]
    }
  },
  initOssInstance () {
    const vm = this
    /**
     * 后端获取阿里云access token, region 参数
     * 初始化oss client，用户上传模板前需要准备好
     */
    server({
      method: 'get',
      url: ''
    })
      .then((response) => {
        vm.ossClient = new OssClient({
          region: response.data.region,
          accessKeyId: response.data.accessKeyId,
          accessKeySecret: response.data.accessKeySecret,
          bucket: response.data.bucket
        })
      })
  },
  created () {
    // 获取导入模板下载地址
    server({
      method: 'get',
      url: 'order/template/get'
    }).then((response) => {
      this.downloadUrl = response.data.data.fileUrl
    })
  },
  mounted () {
    if (this.$refs.footer) {
      this.$refs.footer.parentElement.parentElement.style['min-height'] = '180px'
      this.$refs.footer.parentElement.parentElement.style['display'] = 'none'
    }
    // this.$refs.footer.$parent.style['height'] = '200px'
  },
  methods: {
    handleLoad (response) {
      if (response.data.data.length === 0) {
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
    handleChange (e) {
      const files = e.target.files

      if (!files || files.length === 0) {
        return false
      }
      this.uploadFile(files[0])
      this.$refs.fileInput.value = null
    },
    async uploadFile (file) {
      if (this.ossClient) {
        try {
          this.visible = true
          // 生成随机文件名 Math.floor(Math.random() *10000)
          let randomName = Date.now() + file.name.split('.').pop()
          let result = await this.ossClient.multipartUpload(randomName, file, {
            partSize: 1024 * 1024, // 分片大小 ,1M
            progress: async function (progress) {
              this.progress = progress
            }
          })
          this.visible = false
          this.progress = 0
          this.notifyBackend(randomName, result.name)
        } catch (e) {
          // 捕获超时异常
          if (e.code === 'ConnectionTimeoutError') {
            this.$Message.error('文件上传超时')
            // do ConnectionTimeoutError operation
          }
        }
      }
    },
    /**
     * 通知后端文件名称，
     * 文件上传成功，
     */
    notifyBackend (fileName, fileUrl) {
      server({
        method: 'post',
        url: 'order/template/uploadNotify',
        data: {
          fileName,
          fileUrl
        }
      })
    },
    handleSuccess (res, file) {
      // const vm = this
      if (res.code === 1000) {
        this.$Message.success('导入成功')
      }
    },
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
