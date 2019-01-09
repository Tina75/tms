<template>
  <div class="content">
    <div id="content-main" :style="{'min-height':DocumentHeight +'px'}" class="content-main">
      <div id="content-wrapper" class="wrapper">
        <keep-alive :include="include" :exclude="exclude">
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      height: 500
    }
  },
  computed: {
    ...mapGetters(['DocumentHeight', 'NavTabList']),
    include () {
      return ['a', ...this.NavTabList.length ? this.NavTabList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
    },
    exclude () {
      return [...this.NavTabList.length ? this.NavTabList.filter(item => item.reload).map(item => item.name) : []]
    }
  },
  mounted () {
    window.document.getElementById('content-main').style.minHeight = (document.body.clientHeight - 80) + 'px'
    this.height = document.body.clientHeight - 80
    this.setDocumentHeight(document.body.clientHeight)
    window.onresize = () => {
      this.setDocumentHeight(document.body.clientHeight)
    }
  },
  methods: {
    ...mapActions(['setDocumentHeight'])
  }
}

</script>
<style lang='stylus' scoped>
.content
  padding 15px 20px
  overflow-y auto
  overflow-x hidden
  width: 100%
  &-main
    height: auto
    background white
  .wrapper
    padding 20px 15px
    background white
    height 100%
    overflow: auto
</style>
