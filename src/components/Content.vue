<template>
  <div class="content">
    <div id="content-main" :style="{'min-height':DocumentHeight +'px'}" class="content-main">
      <router-view />
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
    ...mapGetters(['DocumentHeight'])
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
  width: 100%
  &-main
    height: auto
    background white
</style>
