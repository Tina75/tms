<template>
  <div class="page-home-empty">
    <img v-if="type == 'location'" src="../../../assets/location.svg">
    <img v-else-if="type == 'msg'" src="../../../assets/ico-ms.svg">
    <img v-else src="../../../assets/img-empty.png">
    <p>{{msg}}</p>
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      type: String,
      default: '暂无数据～'
    },
    type: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-home-empty
    display flex
    flex-direction column
    justify-content center
    align-items center
    font-size 12px
    height calc( 100% - 60px )
    img
      width 70px
      margin-bottom 8px
    p
      color #999
</style>
