<template>
  <div id="uploadFile">
    <div v-if="uploadImg" class="demo-upload-list">
      <template v-if="true">
        <img :src="uploadImg">
        <div class="demo-upload-list-cover">
          <div style="cursor: pointer;" @click="handleView">
            <Icon type="ios-eye-outline"></Icon>
            <div style="color: #fff;">预览大图</div>
          </div>
          <div style="position: relative;cursor: pointer">
            <div style="cursor: pointer">
              <Icon type="ios-add-circle" size="20"></Icon>
              <input
                ref="fileInput"
                :multiple="multiple"
                type="file"
                class="ivu-upload-input-icon"
                accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                @change="doUpload">
            </div>
            <div style="color: #fff;">重新上传</div>
          </div>
        </div>
      </template>
      <template v-else>
        <Progress :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <div v-else class="ivu-upload" style="display: inline-block; width: 160px;">
      <div class="ivu-upload ivu-upload-drag">
        <input
          ref="fileInput"
          :multiple="multiple"
          type="file"
          class="ivu-upload-input"
          accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
          @change="doUpload">
        <div style="width: 160px;height: 90px;line-height: 90px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </div>
    </div>
    <Modal v-model="visible" title="查看图片">
      <img :src="uploadImg" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import server from '@/libs/js/server'
import OssClient from 'ali-oss'
export default {
  props: {
    // 图片上传最大尺寸,默认2M
    maxSize: {
      type: [String, Number],
      default: 2
    },
    // 是否多图上传
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ossClient: null,
      ossDir: '',
      progress: 0,
      uploadImg: '',
      visible: false,
      viewUrl: ''
    }
  },

  created () {
    this.initOssInstance()
  },

  mounted () {
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
    },
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
            this.$Message.error('图片上传超时')
            // do ConnectionTimeoutError operation
          } else if (e.code === 'RequestError') {
            console.error('请求body格式非法')
          }
          throw e
        }
      }
    },
    handleView (name) {
      this.visible = true
    },
    handleUploadAgain (e) {
      this.doUpload(e)
    }
  }
}
</script>
<style lang='stylus' scoped>
#uploadFile .ivu-upload
  input
    width 160px
    height 90px
    position absolute
    z-index 100
    opacity 0
    cursor pointer
.demo-upload-list
  display inline-block
  width 160px
  height 90px
  text-align center
  line-height 90px
  border 1px solid transparent
  border-radius 4px
  overflow hidden
  background #fff
  position relative
  box-shadow 0 1px 1px rgba(0,0,0,.2)
  margin-right 4px
.demo-upload-list img
  width 100%
  height 100%
.demo-upload-list-cover
  display none
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  background rgba(0,0,0,.6)
.demo-upload-list:hover .demo-upload-list-cover
  display flex
  justify-content space-evenly
  align-items center
  line-height 2
.demo-upload-list-cover i
  color #fff
  font-size 20px
  cursor pointer
  margin 0 2px
.ivu-upload-input-icon
  width 48px
  height 48px
  position absolute
  top 0
  left 0
  z-index 1000
  opacity 0
  cursor pointer
  font-size 0
</style>
<style lang="stylus">
#uploadFile .ivu-upload input[type=file]
  display block
</style>
