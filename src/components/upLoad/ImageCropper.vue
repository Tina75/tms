<template>
  <div class="t-image-crop-box">
    <p v-if="loading" class="t-image-crop-tip t-absolute-center">处理图片中，请稍候...</p>
    <div ref="cropBox" class="t-image-crop">
      <div :class="{ 't-invisible': loading }" class="t-image-crop-body">
        <img ref="image" :src="imageDataUrl" class="t-image-crop-image t-absolute-center">
        <div ref="cropper" class="t-image-crop-area t-absolute"></div>
      </div>

      <div :class="{ 't-invisible': loading }" class="t-image-crop-buttons">
        <a href="javascript:;" class="t-image-crop-buttons-item t-image-crop-buttons-cancel" @click.prevent="cancelCrop">取消</a>
        <a href="javascript:;" class="t-image-crop-buttons-item t-image-crop-buttons-ensure" @click.prevent="ensureCrop">剪裁</a>
      </div>
    </div>
  </div>

</template>

<script>
import ImageManager from './ImageManager'

let $cropBox = null
let cropBoxWidth = 0 // 容器宽度
let cropBoxHeight = 0 // 容器高度
let cropBoxRatio = 0 // 容器宽高比

let $cropper = null // 剪裁框节点
let cropperSize = 0 // 剪裁框尺寸
let cropperOrientation = 'horizontal' // 剪裁框剪裁方向 horizontal | vertical
let cropperTranslation = 0 // 剪裁框位移的距离
let cropperDomRender = null // 剪裁框节点渲染函数
let cropperListenerTrigger = null // 剪裁框事件监听挂载与卸载函数

let touched = false // 鼠标或手指是否按下
let touchPosition = null // 按下的位置

let originImage = null // 原始图片
let $image = null // 图片节点
let imageWidth = 0 // 图片宽度
let imageHeight = 0 // 图片高度
let imageRatio = 0 // 图片宽高比

export default {
  name: 'ImageCrop',
  props: {
    file: {
      type: File,
      required: true
    }
  },
  data () {
    return {
      loading: true,
      imageDataUrl: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setCropBaseConfig()
      this.readFileAsImageAndSet()
    })
  },
  destroyed () {
    $cropBox = $cropper = $image = originImage = cropperDomRender = cropperListenerTrigger = touchPosition = null
  },
  methods: {
    setCropBaseConfig () {
      $cropBox = this.$refs.cropBox
      $image = this.$refs.image
      $cropper = this.$refs.cropper
      cropperDomRender = ImageManager.renderStyle($cropper)
      cropperListenerTrigger = ImageManager.triggerListener($cropper)
    },
    async readFileAsImageAndSet () {
      this.imageDataUrl = await ImageManager.file2DataUrl(this.file)
      originImage = new Image()
      originImage.onload = () => {
        const maxWidth = window.innerWidth / 2
        const maxHeight = window.innerHeight / 2

        if (originImage.width < maxWidth && originImage.height < maxHeight) { // 尺寸过小原图展示
          $image.width = imageWidth = cropBoxWidth = originImage.width
          $image.height = imageHeight = cropBoxHeight = originImage.height
        } else { // 尺寸过大缩放展示
          const ratio = maxWidth / maxHeight
          const imageRatio = originImage.width / originImage.height
          if (ratio > imageRatio) {
            cropBoxHeight = $image.height = imageHeight = maxHeight
            cropBoxWidth = $image.width = imageWidth = maxHeight * imageRatio
          } else {
            cropBoxHeight = cropBoxWidth = $image.width = imageWidth = maxWidth
            $image.height = imageHeight = maxWidth / imageRatio
          }
        }
        cropBoxRatio = cropBoxWidth / cropBoxHeight
        $cropBox.style.width = cropBoxWidth + 'px'
        $cropBox.style.height = cropBoxHeight + 'px'

        this.computedCropAreaSize()
        this.loading = false
      }
      originImage.src = this.imageDataUrl
    },
    // 计算剪裁区域尺寸信息
    computedCropAreaSize () {
      if (imageWidth > imageHeight) {
        cropperSize = imageHeight
        cropperOrientation = 'horizontal'
        cropperTranslation = (imageWidth - cropperSize) / 2 + (cropBoxWidth - imageWidth) / 2

        cropperDomRender('left', cropperTranslation + 'px')
      } else {
        cropperSize = imageWidth
        cropperOrientation = 'vertical'
        cropperTranslation = (imageHeight - cropperSize) / 2 + (cropBoxHeight - imageHeight) / 2

        cropperDomRender('top', cropperTranslation + 'px')
      }

      // 校正剪裁框位置，使其垂直居中
      if (imageRatio < cropBoxRatio && cropperOrientation === 'vertical') cropperDomRender('left', (cropBoxWidth - imageWidth) / 2 + 'px')
      if (imageRatio > cropBoxRatio && cropperOrientation === 'vertical') cropperDomRender('left', 0)
      if (imageRatio > cropBoxRatio && cropperOrientation === 'horizontal') cropperDomRender('top', (cropBoxHeight - imageHeight) / 2 + 'px')
      if (imageRatio < cropBoxRatio && cropperOrientation === 'horizontal') cropperDomRender('top', 0)

      cropperDomRender('width', cropperSize + 'px')('height', cropperSize + 'px')
      this.listenCropperMoved()
    },

    // 剪裁框移动操作
    listenCropperMoved () {
      const events = ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove']
      const fns = [this.startMove, this.endMove, this.cropperOnMoving, this.startMove, this.endMove, this.cropperOnMoving]
      cropperListenerTrigger('remove', events, fns)('add', events, fns)
    },
    startMove (e) {
      e.preventDefault()
      touched = true
      const touch = e.touches ? e.touches[0] : e
      touchPosition = { x: touch.clientX, y: touch.clientY }
    },
    endMove (e) {
      e.preventDefault()
      touched = false
      touchPosition = null
    },
    // 移动剪裁框
    cropperOnMoving (e) {
      if (!touched) return

      e.preventDefault()
      const touch = e.touches ? e.touches[0] : e
      const currentPosition = { x: touch.clientX, y: touch.clientY }
      const differ = this.getTouchDiffer(currentPosition)

      if (cropperOrientation === 'vertical') { // 剪裁框垂直移动
        cropperTranslation += differ.dy

        // 上边界校验
        if (cropperTranslation <= (cropBoxHeight - imageHeight) / 2) {
          cropperTranslation = (cropBoxHeight - imageHeight) / 2
        }
        // 下边界校验
        if (cropperTranslation + cropperSize >= cropBoxHeight - (cropBoxHeight - imageHeight) / 2) {
          cropperTranslation = cropBoxHeight - (cropBoxHeight - imageHeight) / 2 - cropperSize
        }

        cropperDomRender('top', cropperTranslation + 'px')
      } else { // 剪裁框水平移动
        cropperTranslation += differ.dx

        // 左边界校验
        if (cropperTranslation <= (cropBoxWidth - imageWidth) / 2) {
          cropperTranslation = (cropBoxWidth - imageWidth) / 2
        }
        // 右边界校验
        if (cropperTranslation + cropperSize >= cropBoxWidth - (cropBoxWidth - imageWidth) / 2) {
          cropperTranslation = cropBoxWidth - (cropBoxWidth - imageWidth) / 2 - cropperSize
        }

        cropperDomRender('left', cropperTranslation + 'px')
      }

      touchPosition = currentPosition
    },
    // 计算两次触摸事件之间的位置差距
    getTouchDiffer (touch) {
      return {
        dx: touch.x - touchPosition.x,
        dy: touch.y - touchPosition.y
      }
    },

    // 取消剪裁
    cancelCrop () {
      this.$emit('on-cancel')
    },
    // 确定剪裁
    ensureCrop () {
      // 剪裁框位移距离需要减去图片与屏幕上边与左边的黑色部分的距离
      if (cropperOrientation === 'vertical') cropperTranslation -= ((cropBoxHeight - imageHeight) / 2)
      else cropperTranslation -= ((cropBoxWidth - imageWidth) / 2)

      // 计算剪裁的起始位置
      let cropPosition = 0
      if (originImage.width > originImage.height) cropPosition = cropperTranslation / imageWidth * originImage.width
      else cropPosition = cropperTranslation / imageHeight * originImage.height
      const croppedDataUrl = ImageManager.cropImage(this.$refs.image, cropPosition, originImage.width > originImage.height ? originImage.height : originImage.width)
      this.$emit('on-crop', ImageManager.base64Url2Blob(croppedDataUrl))
    }
  }
}
</script>

<style scoped>
.t-image-crop-box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #000;
  z-index: 1000;
}

.t-image-crop {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.t-absolute {
  position: absolute;
}

.t-invisible {
  opacity: 0;
}

.t-absolute-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.t-image-crop-tip {
  color: #fff;
  font-size: 10px;
}

.t-image-crop-image {
  position: absolute;
  width: 100%;
}

.t-image-crop-area {
  border: 1px solid rgba(255, 255, 255, .5);
  box-shadow: 0 1px 10px rgba(0,0,0,1);
  cursor: move;
}

.t-image-crop-area:before, .t-image-crop-area:after {
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.t-image-crop-area:before {
  width: 100%;
  height: 33.333333%;
  border-top: 1px dashed rgba(255, 255, 255, .5);
  border-bottom: 1px dashed rgba(255, 255, 255, .5);
}

.t-image-crop-area:after {
  width: 33.333333%;
  height: 100%;
  border-left: 1px dashed rgba(255, 255, 255, .5);
  border-right: 1px dashed rgba(255, 255, 255, .5);
}

.t-image-crop-mask {
  background: rgba(255, 255, 255, .5)
}

.t-image-crop-buttons-item {
  position: absolute;
  bottom: -50px;
  padding: 5px 10px;
  color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 4px;
  text-shadow: 1px 1px 0 rgba(0,0,0,1);
  box-shadow: 0 1px 10px rgba(0,0,0,1);
  z-index: 1;
}

.t-image-crop-buttons-cancel {
  right: 60%;
}

.t-image-crop-buttons-ensure {
  left: 60%;
}
</style>
