<template>
  <div class="content">
    <div :style="{'min-height':height +'px'}" class="content-main">
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
    this.height = document.body.clientHeight - 80
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
