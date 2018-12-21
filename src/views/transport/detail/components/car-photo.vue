<template>
  <div>
    <div class="detail-part-title">
      <span>车况照片</span>
    </div>
    <div style="width: 900px;margin-top: 30px;">
      <div
        v-for="(item, index) in imageList"
        :key="index"
        :style="'cursor: pointer;display: inline-block;width: 160px;margin-right: 16px;height: 90px;background-image: url(' + item.src + '?x-oss-process=image/resize,w_160);background-repeat: no-repeat;background-position: center;'"
        @click="handleView(index)">
      </div>
    </div>
  </div>
</template>

<script>
import openSwipe from '@/components/swipe/index'

export default {
  name: 'carPhoto',
  props: {
    // 传入的图片list集合
    imageList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      imgViewFunc: null
    }
  },
  computed: {
  },

  created () {
    this.imgViewFunc = openSwipe(this.imageList)
  },

  methods: {
    // 预览
    handleView (i) {
      this.imgViewFunc(i)
    }
  }
}
</script>
<style lang='stylus' scoped>

</style>
