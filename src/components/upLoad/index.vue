<template>
  <div id="uploadFile">
    <div v-if="multiple && !crop" :style="multipleWidth">
      <div v-for="(pic, index) in uploadImgList" :key="index" class="demo-upload-list">
        <template v-if="pic.progress === 1">
          <!-- <img :src="pic.url"> -->
          <div v-imgFormat="pic.url" :style="'height: 90px;background-image: url(' + pic.url + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"></div>
          <div class="demo-upload-list-cover">
            <div style="cursor: pointer;" @click="handleView(index)">
              <div class="eye-circle">
                <FontIcon type="ico_see" size="16" color="#fff"></FontIcon>
              </div>
              <div class="icon-letter">预览</div>
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
          <label class="ivu-upload-input">
            <input
              ref="fileInput"
              :multiple="multiple"
              type="file"
              class="ivu-upload-input"
              style="display: none;"
              accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
              @change="inputChanged">
            <div style="width: 160px;height: 90px;">
              <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%)">
                <div class="eye-circle">
                  <FontIcon type="ico_add2" size="14" color="#fff"></FontIcon>
                </div>
                <div class="icon-letter" style="color: #00A4BD;">点击上传</div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="showPreview" class="demo-upload-list">
        <template v-if="progress === 1">
          <div v-imgFormat="uploadImg" :style="'height: 90px;background-image: url(' + uploadImg + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"></div>
          <div class="demo-upload-list-cover">
            <div style="cursor: pointer;" @click="handleView(0)">
              <div class="eye-circle">
                <FontIcon type="ico_see" size="16" color="#fff"></FontIcon>
              </div>
              <div class="icon-letter">预览</div>
            </div>
            <div style="position: relative;cursor: pointer">
              <div style="cursor: pointer">
                <div class="eye-circle">
                  <FontIcon type="ico_add2" size="14" color="#fff"></FontIcon>
                </div>
                <label class="ivu-upload-input-icon">
                  <input
                    ref="fileInput"
                    :multiple="multiple && !crop"
                    type="file"
                    class="ivu-upload-input-icon"
                    style="display: none;"
                    accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                    @change="inputChanged">
                </label>
              </div>
              <div class="icon-letter">修改</div>
            </div>
          </div>
        </template>
        <template v-else>
          <Progress :percent="progress * 100" hide-info></Progress>
        </template>
      </div>
      <div v-else class="ivu-upload" style="display: inline-block; width: 160px;">
        <div class="ivu-upload ivu-upload-drag">
          <label class="ivu-upload-input">
            <input
              ref="fileInput"
              :multiple="multiple && !crop"
              type="file"
              class="ivu-upload-input"
              style="display: none;"
              accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
              @change="inputChanged">
            <div style="width: 160px;height: 90px;">
              <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%)">
                <div class="eye-circle">
                  <FontIcon type="ico_add2" size="14" color="#fff"></FontIcon>
                </div>
                <div class="icon-letter" style="color: #00A4BD;">点击上传</div>
              </div>
            </div>
          </label>
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
// import ImageCropper from './ImageCropper'
import FontIcon from '@/components/FontIcon'
import openSwipe from '@/components/swipe/index'
import { initOssInstance, showCropper } from './index.js'
import { clearFileInput } from '@/libs/js/util'
export default {
  name: 'UpLoad',

  components: {
    FontIcon
  },

  props: {
    crop: {
      type: Boolean,
      default: false
    },
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
    },
    multipleWidth: {
      type: String,
      default: 'width: 550px;'
    }
  },
  data () {
    return {
      ossClient: null,
      ossDir: '',
      progress: 0,
      showPreview: false, // 单图展示预览
      uploadImg: '', // 单图上传回显
      uploadImgList: [], // 多图上传回显
      curImg: '', // 当前操作的图片
      visible: false,
      viewUrl: '',
      imgViewFunc: null // 图片预览方法
    }
  },
  watch: {
    // 多图已上传图片回显
    uploadImgList (val) {
      this.setUploadImgList()
    },
    // 单图已上传图片回显
    uploadImg () {
      this.showPreview = true
      this.setUploadImg()
    }
  },
  created () {
    initOssInstance(this)
  },

  methods: {
    setUploadImgList () {
      let imageItems = this.uploadImgList.map((i) => {
        return {
          src: i.url,
          msrc: i.url
        }
      })
      this.imgViewFunc = openSwipe(imageItems)
    },
    setUploadImg () {
      let imageItems = []
      imageItems.push({
        src: this.uploadImg,
        msrc: this.uploadImg
      })
      this.imgViewFunc = openSwipe(imageItems)
    },

    inputChanged (e) {
      const files = e.target.files
      if (!files || files.length === 0) return
      if (this.crop) {
        this.cropImage(files[0]) // 处理剪裁
      } else if (!this.multiple) {
        this.singleUpload(files[0]) // 单图上传
      } else {
        this.multipleUpload(files) // 多图上传
      }
    },

    async uploadFile (file) {
      if (this.ossClient) {
        try {
          let mime = file.name ? file.name.split('.').pop() : file.type.split('/').pop()
          let randomName = new Date().getTime() * Math.random() + '.' + mime
          let result
          if (navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0) {
            result = await this.ossClient.put(this.ossDir + randomName, file)
          } else {
            result = await this.ossClient.multipartUpload(this.ossDir + randomName, file, {
              partSize: 1024 * 500, // 分片大小 ,500K
              progress: (progress, pp) => {
                if (progress) {
                  this.progress = progress
                }
              }
            })
          }
          return result
        } catch (error) {
          // 捕获超时异常
          if (error.code === 'ConnectionTimeoutError') {
            this.$Message.error('图片上传超时')
          } else if (error.code === 'RequestError') {
            console.error('请求body格式非法')
          } else if (error.code === 'InvalidAccessKeyId' || error.code === 'InvalidBucketName') {
            this.$Message.info({ content: '重新获取认证信息，正在上传', duration: 3 })
            await this.initOssInstance()
            this.uploadFile(file)
          } else {
            this.$Message.error({ content: '上传图片失败', duration: 3 })
          }
        }
      }
    },

    validateImageFile (file) {
      if (file.name && file.name.length > 58) {
        this.$Message.warning('上传文件名长度请勿超过58位')
        clearFileInput(this.$refs.fileInput)
        return false
      }
      if (file.size > this.maxSize * 1024 * 1024) {
        this.$Message.warning(`图片大小不能超过${this.maxSize}M`)
        clearFileInput(this.$refs.fileInput)
        return false
      }
      return true
    },

    // 单图上传
    async singleUpload (file) {
      if (!this.validateImageFile(file)) return
      this.showPreview = true
      this.progress = 0
      const uploadResult = await this.uploadFile(file)
      this.uploadImg = uploadResult.res.requestUrls[0].split('?')[0]
      this.$Message.success({ content: '上传成功', duration: 3 })
      this.setUploadImg()
    },
    // 多图上传
    async multipleUpload (files) {
      if ((files.length + this.uploadImgList.length) > this.maxCount) {
        this.$Message.warning(`图片最多上传${this.maxCount}张`)
        clearFileInput(this.$refs.fileInput)
        return
      }
      for (let i = 0; i < files.length; i++) {
        if (!this.validateImageFile(files[i])) return

        const uploadResult = await this.uploadFile(files[i])
        this.uploadImgList.push({
          url: uploadResult.res.requestUrls[0].split('?')[0],
          progress: navigator.userAgent.toLowerCase().indexOf('msie 10') >= 0 ? 1 : this.progress
        })
        this.$Message.success({ content: '上传成功', duration: 3 })
        this.setUploadImgList()
      }

      clearFileInput(this.$refs.fileInput)
    },

    // 剪裁图片
    cropImage (file) {
      showCropper({
        file,
        cropEnsure: file => {
          this.singleUpload(file)
        }
      })
    },

    // 预览
    handleView (i) {
      this.imgViewFunc(i)
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
.ivu-upload-input
  width 160px
  height 90px
  position absolute
  cursor pointer
.ivu-upload-drag
  height 90px
  text-align left
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
  -webkit-justify-content space-around
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
