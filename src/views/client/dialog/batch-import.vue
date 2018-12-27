<template>
  <Modal v-model="visiable" :mask-closable="false" class="ivu-upload" transfer @on-visible-change="close" >
    <p slot="header" style="text-align:center">批量导入</p>
    <div
      class="i-mb-10 ivu-upload upload"
      @click="handleClick"
      @drop.prevent="onDrop"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false">
      <input
        ref="fileInput"
        name="file"
        type="file"
        class="ivu-upload-input"
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="handleChange"/>
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>将文件拖至此处，或<a>点击导入</a></p>
      </div>
    </div>
    <div slot="footer">
      <Button type="primary">下载模板</Button>
      <Button style="margin-left: 8px" @click.native="close">取消</Button>
    </div>
  </Modal>
</template>
<script>
import BaseDialog from '@/basic/BaseDialog'
import { clearFileInput } from '@/libs/js/util'
import server from '@/libs/js/server'
import { initOssInstance } from '@/components/upLoad/index'
export default {
  name: 'batch-import',
  mixins: [ BaseDialog ],
  data () {
    return {
      dragOver: false,
      progress: 0,
      ossClient: null,
      ossDir: '',
      notifyRequestUrl: 'order/template/uploadNotify'
    }
  },
  created () {
    initOssInstance(this)
  },
  methods: {
    handleClick () {
      this.$refs.fileInput.click()
    },
    onDrop (e) {
      this.dragOver = false
      this.uploadFile(e.dataTransfer.files)
    },
    async handleChange (e) {
      const files = e.target.files

      if (!files || files.length === 0) {
        return false
      }
      // if (!this.canUpload) {
      //   this.$Toast.warning({
      //     content: '最多只支持3个表格同时导入哦~'
      //   })
      //   return false
      // }
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
          // this.visible = true
          // this.fetch()
          //   .then((res) => {
          //     clearFileInput(this.$refs.fileInput)
          //     this.loopCheckFileProgress(notifyResult.data.data.id)
          //   })
        }
      } catch (error) {
        if (error.code === 'InvalidAccessKeyId' || error.code === 'InvalidBucketName') {
          // token失效过期了
          this.$Message.info({ content: '重新获取认证信息，文件正在上传', duration: 3 })
          initOssInstance()
          this.handleChange(e)
        } else {
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
    }
  }
}
</script>
<style lang="stylus" scoped>
.upload
  text-align: center;
  background: #f7f7f7;
  border-radius: 4px;
</style>
