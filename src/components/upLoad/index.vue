<template>
  <div id="uploadFile">
    <div v-if="multiple" style="width: 550px;">
      <div v-for="(pic, index) in uploadImgList" :key="index" class="demo-upload-list">
        <template v-if="pic.progress === 1">
          <!-- <img :src="pic.url"> -->
          <div :style="'height: 90px;background-image: url(' + pic.url + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"></div>
          <div class="demo-upload-list-cover">
            <div style="cursor: pointer;" @click="handleView(index)">
              <div class="eye-circle">
                <FontIcon type="ico_see" size="16" color="#fff"></FontIcon>
              </div>
              <div class="icon-letter">预览大图</div>
            </div>
            <div style="cursor: pointer;" @click="handleRemove(index)">
              <div class="eye-circle">
                <FontIcon type="ico_delete" size="16" color="#fff"></FontIcon>
              </div>
              <div class="icon-letter">删除</div>
            </div>
          </div>
        </template>
        <template v-else>
          <Progress :percent="pic.progress * 100" hide-info></Progress>
        </template>
      </div>
      <div v-if="uploadImgList.length < maxCount" class="ivu-upload" style="display: inline-block; width: 160px;">
        <div class="ivu-upload ivu-upload-drag">
          <input
            ref="fileInput"
            :multiple="multiple"
            type="file"
            class="ivu-upload-input"
            accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
            @change="doUpload">
          <div style="width: 160px;height: 90px;">
            <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%)">
              <div class="eye-circle">
                <FontIcon type="ico_add2" size="14" color="#fff"></FontIcon>
              </div>
              <div class="icon-letter" style="color: #00A4BD;">点击上传</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="uploadImg" class="demo-upload-list">
        <template v-if="progress === 1">
          <!-- <img :src="uploadImg"> -->
          <div :style="'height: 90px;background-image: url(' + uploadImg + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"></div>
          <div class="demo-upload-list-cover">
            <div style="cursor: pointer;" @click="handleView">
              <div class="eye-circle">
                <FontIcon type="ico_see" size="16" color="#fff"></FontIcon>
              </div>
              <div class="icon-letter">预览大图</div>
            </div>
            <div style="position: relative;cursor: pointer">
              <div style="cursor: pointer">
                <div class="eye-circle">
                  <FontIcon type="ico_add2" size="14" color="#fff"></FontIcon>
                </div>
                <input
                  ref="fileInput"
                  :multiple="multiple"
                  type="file"
                  class="ivu-upload-input-icon"
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                  @change="doUpload">
              </div>
              <div class="icon-letter">重新上传</div>
            </div>
          </div>
        </template>
        <template v-else>
          <Progress :percent="progress * 100" hide-info></Progress>
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
          <div style="width: 160px;height: 90px;">
            <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%)">
              <div class="eye-circle">
                <FontIcon type="ico_add2" size="14" color="#fff"></FontIcon>
              </div>
              <div class="icon-letter" style="color: #00A4BD;">点击上传</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="visible" transfer title="查看图片">
      <img v-if="multiple" :src="curImg" style="width: 100%">
      <img v-else :src="uploadImg" style="width: 100%">
      <div slot="footer" style="text-align: center;"></div>
    </Modal>
  </div>
</template>
<script>
import server from '@/libs/js/server'
import OssClient from 'ali-oss'
import FontIcon from '@/components/FontIcon'
export default {
  name: 'UpLoad',

  components: {
    FontIcon
  },

  props: {
    // 图片上传最大尺寸,默认2M
    maxSize: {
      type: [String, Number],
      default: 10
    },
    // 图片上传最大张数, 默认6张
    maxCount: {
      type: [String, Number],
      default: 6
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
      uploadImg: '', // 单图上传
      uploadImgList: [], // 多图上传
      curImg: '', // 当前操作的图片
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
      console.log(files)
      if (!files || files.length === 0) {
        return false
      }
      if (this.multiple) {
        await this.multipleUpload(e, files)
      } else {
        await this.singleUpload(e, files)
      }
    },
    async uploadFile (file) {
      const vm = this
      if (this.ossClient) {
        try {
          // this.visible = true
          // 生成随机文件名 Math.floor(Math.random() *10000)
          let randomName = file.name.split('.')[0] + new Date().Format('yyyyMMddhhmmss') + '.' + file.name.split('.').pop()
          let result = await this.ossClient.multipartUpload(this.ossDir + randomName, file, {
            partSize: 1024 * 500, // 分片大小 ,500K
            progress: function (progress, pp) {
              if (progress) {
                vm.progress = progress
                console.log(vm.progress)
              }
            }
          })
          this.$nextTick(() => {
            // this.visible = false
            // vm.progress = 1
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
    // 单图上传
    async singleUpload (e, files) {
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
      this.uploadImg = ' '
      try {
        const uploadResult = await this.uploadFile(file)
        console.log(uploadResult)
        this.uploadImg = uploadResult.res.requestUrls[0].split('?')[0]
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
    },
    // 多图上传
    async multipleUpload (e, files) {
      if ((files.length + this.uploadImgList.length) > this.maxCount) {
        this.$Message.warning(`图片最多上传${this.maxCount}张`)
        this.$refs.fileInput.value = null
        return
      }
      for (let i = 0; i < files.length; i++) {
        if (files[i].name.length > 58) {
          this.$Message.warning('上传文件名长度请勿超过58位')
          this.$refs.fileInput.value = null
          return
        }
        if (files[i].size > this.maxSize * 1024 * 1024) {
          this.$Message.warning(`图片大小不能超过${this.maxSize}M`)
          this.$refs.fileInput.value = null
          return
        }
        try {
          const uploadResult = await this.uploadFile(files[i])
          console.log(uploadResult)
          this.uploadImgList.push({ url: uploadResult.res.requestUrls[0].split('?')[0], progress: this.progress })
          this.$Message.success({ content: '上传成功', duration: 3 })
          // this.$refs.fileInput.value = null
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
      }
      this.$refs.fileInput.value = null
    },
    // 预览
    handleView (i) {
      this.visible = true
      this.multiple && (this.curImg = this.uploadImgList[i].url)
    },
    // 删除
    handleRemove (i) {
      this.uploadImgList.splice(i, 1)
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
  border-radius 4px
  overflow hidden
  background #fff
  position relative
  box-shadow 0 1px 1px rgba(0,0,0,.2)
  margin-right 20px
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
  display: -ms-flexbox
  justify-content space-evenly
  -ms-flex-pack:distribute;
  align-items center
  -ms-flex-align center
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
.eye-circle
  width 20px
  height 20px
  margin 6px auto
  text-align center
  line-height 20px
  border-radius 50%
  background-color #00A4BD
.icon-letter
  height 22px
  font-size 12px
  font-family 'PingFangSC-Regular'
  font-weight 400
  color rgba(255,255,255,0.8)
  line-height 22px
</style>
<style lang="stylus">
#uploadFile .ivu-upload input[type=file]
  display block
</style>
