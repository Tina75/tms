<template>
  <div class="content">
    <div :style="{'min-height':DocumentHeight +'px'}" class="content-main">
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
  &-main
    background white
</style>
