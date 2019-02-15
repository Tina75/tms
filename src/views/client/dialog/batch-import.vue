<template>
  <Modal v-model="visiable" :mask-closable="false" class="ivu-upload" transfer @on-visible-change="close" >
    <p slot="header" style="text-align:center">{{title}}</p>
    <input
      ref="fileInput"
      name="file"
      type="file"
      class="ivu-upload-input"
      accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      @change="handleChange"/>
    <div
      v-if="percent == 0 && !failStatue"
      class="i-mb-10 ivu-upload upload"
      @click="handleClick"
      @drop.prevent="onDrop"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false">
      <div style="padding: 20px 0">
        <FontIcon type="daoru" size="52" style="color: #00a4bd"></FontIcon>
        <p>将文件拖至此处，或<a>点击导入</a></p>
      </div>
    </div>
    <div v-else class="i-mb-10 ivu-upload upload" >
      <div style="padding: 20px 0">
        <FontIcon v-if="percent == 100" type="ico-right" color="#00C185" size="37"/>
        <FontIcon v-if="failStatue" type="ico-fault" color="#EE2017" size="37"/>
        <Progress :percent="percent" class="progress"/>
        <!-- 导入中 -->
        <div v-if="percent != 100 && !failStatue">
          <p>正在导入 {{fileName}}</p>
        </div>
        <!-- 导入成功 -->
        <div v-if="percent == 100">
          <p class="i-mb-10">导入成功 共导入{{ listLength }}条数据</p>
          <a @click="handleClick">继续导入</a>
        </div>
        <!-- 导入失败 -->
        <div v-if="failStatue">
          <p class="i-mb-10" style="color: red">导入失败，请查看错误报告</p>
          <a style="margin-right: 8px" @click="downLoadReport">下载错误报告</a>
          <a @click="handleClick">重新导入</a>
        </div>
      </div>
    </div>
    <div slot="footer">
      <a :href="downLoadUrl" class="i-ml-10 ivu-btn ivu-btn-primary">下载模板</a>
      <Button style="margin-left: 8px" @click.native="closeDialog">关闭</Button>
    </div>
  </Modal>
</template>
<script>
import server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import FontIcon from '@/components/FontIcon'
import { clearFileInput } from '@/libs/js/util'
import { initOssInstance } from '@/components/upLoad/index'
export default {
  name: 'batch-import',
  components: { FontIcon },
  mixins: [ BaseDialog ],
  data () {
    return {
      dragOver: false,
      progress: 0,
      ossClient: null,
      ossDir: '',
      timer: null,
      percent: 0,
      failStatue: false,
      errorReport: '',
      listLength: 0,
      fileName: ''
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
      this.handleUpload(e.dataTransfer.files)
    },
    handleChange (e) {
      const files = e.target.files
      this.handleUpload(files)
    },
    async handleUpload (files) {
      this.failStatue = false
      this.errorReport = ''
      if (!files || files.length === 0) {
        return false
      }
      const file = files[0]
      if (file.name.length > 58) {
        this.$Message.warning('上传文件名长度请勿超过58位')
        clearFileInput(this.$refs.fileInput)
        return
      }
      const vm = this
      this.fileName = file.name
      try {
        const uploadResult = await this.uploadFile(file)
        let fileUrl = uploadResult.name
        this.notifyBackend(file.name, fileUrl).then(res => {
          const { code, data } = res.data
          if (code === 10000) {
            vm.percent = 100
            vm.listLength = data
          }
          if (vm.timer) {
            clearTimeout(vm.timer)
            vm.timer = null
          }
          clearFileInput(this.$refs.fileInput)
        }).catch((err) => {
          vm.$nextTick(() => {
            vm.failStatue = true
          })
          vm.errorReport = err.data.data
          if (vm.timer) {
            clearTimeout(vm.timer)
            vm.timer = null
          }
          clearFileInput(vm.$refs.fileInput)
        })
        vm.loopCheckFileProgress()
      } catch (error) {
        if (error.code === 'InvalidAccessKeyId' || error.code === 'InvalidBucketName') {
          // token失效过期了
          this.$Message.info({ content: '重新获取认证信息，文件正在上传', duration: 3 })
          initOssInstance()
          this.handleUpload(files)
        } else {
          this.$Message.error({ content: '导入订单文件失败', duration: 3 })
        }
      }
    },
    async uploadFile (file) {
      if (this.ossClient) {
        try {
          // 生成随机文件名 Math.floor(Math.random() *10000)
          let result = null
          let randomName = new Date().getTime() * Math.random() + '.' + file.name.split('.').pop()
          if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
            result = await this.ossClient.put(this.ossDir + randomName, file)
          } else {
            result = await this.ossClient.multipartUpload(this.ossDir + randomName, file, {
              partSize: 1024 * 1024, // 分片大小 ,1M
              progress: function (progress, pp) {}
            })
          }
          return result
        } catch (e) {
          // 捕获超时异常
          if (e.code === 'ConnectionTimeoutError') {
            this.$Message.error('文件上传超时')
          } else if (e.code === 'RequestError') { }
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
    /**
     * 定时轮询接口，查看进度
     */
    loopCheckFileProgress (importId) {
      const vm = this
      vm.timer = null
      // 塞入初始进度值
      vm.percent = vm.rangeRandom(20)
      function checkProgress () {
        try {
          vm.timer = setTimeout(async () => {
            let { percent } = vm
            vm.updateProgress(vm.rangeRandom(percent))
            checkProgress()
          }, 500)
        } catch (error) {
          if (vm.timer) {
            clearTimeout(vm.timer)
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
    updateProgress (percent) {
      this.percent = percent
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
    closeDialog () {
      if (this.percent === 100) {
        this.ok()
        this.close()
      } else {
        this.close()
      }
    },
    downLoadReport () {
      if (this.errorReport) {
        window.location.href = this.errorReport
      } else {
        this.$Message.error('导入数据为空，没有错误报告')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.upload
  text-align center
  background #f9f9f9
  border-radius 4px
</style>
<style lang="stylus">
.upload
  .ivu-progress-inner
    background-color #e4e7ec
  .ivu-progress-bg
    background -webkit-linear-gradient(to right, #00a7bf, #00cede)
    background -moz-linear-gradient(to right, #00a7bf, #00cede)
    background linear-gradient(to right, #00a7bf, #00cede)
</style>
