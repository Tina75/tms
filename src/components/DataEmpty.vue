<template>
  <div class="data-empty">
    <img src="../assets/img-empty.png" class="data-empty-img">
    <p><slot></slot></p>
  </div>
</template>
<style lang="stylus" scoped>
.data-empty
  .data-empty-img
    display: block
    width 70px
    height: auto
    margin 100px auto 12px
  p
    color #999999
    text-align center
</style>
