<template>
  <div id="app" class="login">
    <header class="login-header">

    </header>

    <div class="login-body">
      <router-view />
    </div>

    <footer class="login-footer">
      版权所有·智加云 Copyright &#169; 2018 5566.com All Rights Reserved
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style lang="stylus" scoped>
  .login
    position relative
    width 100%
    height 100%
    background #252A2F

    &-header
      height 88px
      border-bottom 1px solid #3A424B

    &-footer
      height 128px
      line-height 128px
      color #FFFFFF
      text-align center
      background #2E3338

    &-body
      position relative
      min-height 550px
      height calc( 100% - 216px )
</style>
