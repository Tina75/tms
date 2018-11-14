<template>
  <div class="data-empty">
    <img src="../../../assets/img-empty.png" class="data-empty-img">
    <p><slot></slot></p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.data-empty
  display flex
  flex-direction column
  justify-content center
  align-items center
  margin-top 200px
  /*min-height 416px*/
  .data-empty-img
    width 70px
    margin-bottom 12px
  p
    color #999999
    text-align center
</style>
