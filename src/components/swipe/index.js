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

const prepareOpenPhotoSwipe = (items) => {
  // 设置宽高
  items.forEach((item) => {
    if (!item.src) {
      throw new Error('图片src参数错误')
    }
    let img = new Image()
    img.src = item.src
    img.onload = function () {
      item.w = img.naturalWidth || img.width
      item.h = img.naturalHeight || img.height
      img = null
    }
  })
  return (index = 0, options = {}) => {
    let SwipeInstance = new Vue({
      mixins: [SwipeComponent]
    })
    options.history = false
    options.focus = false
    let component = SwipeInstance.$mount()
    document.body.appendChild(component.$el)
    const photoSwipeOptions = {
      index,
      ...options
    }

    const gallery = new PhotoSwipe(
      component.$el.children[0],
      PhotoSwipeUIDefault,
      items,
      photoSwipeOptions
    )
    gallery.init()
    gallery.listen('close', function () {
      document.body.removeChild(component.$el)
      SwipeInstance = null
    })
  }
}

export default prepareOpenPhotoSwipe
