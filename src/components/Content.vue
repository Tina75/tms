<template>
  <div class="content">
    <div id="content-main" :style="{'min-height':height +'px'}" class="content-main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      height: 500
    }
  },
  mounted () {
    window.document.getElementById('content-main').style.minHeight = (document.body.clientHeight - 80) + 'px'
    this.height = document.body.clientHeight - 80
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
