import Vue from 'vue'
import SwipeComponent from './swipe.vue'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'
/**
 * 显示弹出层
 * @param {number} index 当前显示的图片索引
 * @param {array<title,src,msrc,w,h>} items 图片列表
 * @param {object} options photoswipe 选项
 */
const openPhotoSwipe = (index = 0, items, options = {}) => {
  let SwipeInstance = new Vue({
    mixins: [SwipeComponent]
  })

  let component = SwipeInstance.$mount()
  document.body.appendChild(component.$el)
  const photoSwipeOptions = {
    index
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

export default openPhotoSwipe
