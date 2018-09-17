<template>
  <div id="app" class="login">
    <header class="login-header">
      <span>1</span>
      <div class="login-header-tel">
        <p>400-788-5656</p>
        <p>客服电话</p>
      </div>
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
    overflow auto

    &-header
      display flex
      align-items center
      justify-content space-between
      height 88px
      padding 0 43px 0 143px
      border-bottom 1px solid #3A424B

      &-tel
        flex none
        display flex
        flex-direction column
        color #00A4BD

        & p
          text-align right

          &:first-child
            font-size 20px
            font-weight bolder
          &:last-child
            font-size 14px
            font-weight bold

    &-footer
      height 128px
      line-height 128px
      color #FFFFFF
      text-align center
      background #2E3338

    &-body
      display flex
      align-items center
      justify-content center
      position relative
      min-height 550px
      height calc( 100% - 216px )
</style>
