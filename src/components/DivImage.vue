<template>
  <div
    :style="imgStyle"
    class="div-img">
  </div>
</template>

<script>
const URL_HOST = process.env.VUE_APP_IMG_HOST
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    height: {
      type: [String, Number],
      default: 90
    },
    width: {
      type: [String, Number],
      default: 160
    }
  },
  data () {
    return {
      imgSrc: ''
    }
  },
  computed: {
    imgStyle () {
      return 'height:' + this.height + 'px;width:' + this.width + 'px;backgroundImage:url(' + this.imgSrc + ')'
    }
  },
  watch: {
    src (newVal) {
      this.configUrl(newVal)
    }
  },
  mounted () {
    this.configUrl(this.src)
  },
  methods: {
    configUrl (newVal) {
      if (!newVal) return
      let config = `?x-oss-process=image/resize,m_fill,h_${this.height},w_${this.width}`
      if (newVal.indexOf('aliyuncs.com') > 0) {
        this.imgSrc = `${newVal}${config}`
      } else {
        this.imgSrc = `${URL_HOST}${newVal}${config}`
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
  .div-img
    background-repeat no-repeat
    background-position center
    cursor pointer
</style>
