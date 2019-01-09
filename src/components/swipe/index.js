import Vue from 'vue'
import SwipeComponent from './swipe.vue'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'
/**
 * 显示弹出层
 * 原插件需要在图片列表里传w宽，h高参数，但是容易引起图片压缩等问题
 * 需要提前处理好图片的宽高
 * @param {number} index 当前显示的图片索引
 * @param {array<title,src,msrc>} items 图片列表
 * @param {object} options photoswipe 选项
 */
import LoadingImg from '@/assets/loading.gif'
const prepareOpenPhotoSwipe = (items) => {
  // 等先用loading图片替换原实际图片，在loaded图片后，再用原图
  let transferItems = items.map((item) => {
    let { src, ...rest } = item
    return {
      src: LoadingImg,
      realSrc: item.src,
      isLoadingImg: true,
      w: 36,
      h: 36,
      ...rest
    }
  })

  return (index = 0, options = {}) => {
    let SwipeInstance = new Vue({
      mixins: [SwipeComponent]
    })
    Object.assign(options, {
      history: false,
      focus: false,
      closeOnScroll: false,
      closeOnVerticalDrag: false,
      clickToCloseNonZoomable: false,
      closeElClasses: []
    })
    let component = SwipeInstance.$mount()
    document.body.appendChild(component.$el)
    const photoSwipeOptions = {
      index,
      ...options
    }
    let queue = []
    const initSwiper = function () {
      const gallery = new PhotoSwipe(
        component.$el.children[0],
        PhotoSwipeUIDefault,
        transferItems,
        photoSwipeOptions
      )
      gallery.init()
      gallery.listen('close', function () {
        document.body.removeChild(component.$el)
        SwipeInstance = null
        queue = []
      })
      gallery.listen('gettingData', function (index, item) {
        if (item.isLoadingImg && !queue.includes(index)) {
          let img = new Image()
          img.onload = function () {
            item.w = img.naturalWidth || img.width
            item.h = img.naturalHeight || img.height
            item.src = img.src
            item.isLoadingImg = false
            gallery.invalidateCurrItems()
            gallery.updateSize(true)
          }
          img.src = item.realSrc
          queue.push(index)
        }
      })
    }
    initSwiper()
    // if (isComplete) {
    // } else {
    //   let timer = setInterval(() => {
    //     if (isComplete) {
    //       clearInterval(timer)
    //       timer = null
    //       initSwiper()
    //     }
    //   }, 500)
    // }
  }
}

export default prepareOpenPhotoSwipe
