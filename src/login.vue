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

<style lang="stylus">
  body
    overflow auto
  ul
    list-style none

  // iview样式覆盖
  .ivu-form-item
    margin-bottom 20px
  .ivu-form-item:last-child
    margin-bottom: 0
  .ivu-input-group-prepend
    background transparent
    border-right none

  // 登录页面通用样式
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

  // 表单样式
  .form-body
    position absolute

    .ivu-input-wrapper
      position relative

    .form-title
      padding-top 15px
      border-bottom none
      text-align center
      font-weight bolder
      font-size 18px

    .form-content
      margin 24px

    .form-captcha-input
      width calc( 100% - 112px )

      .ivu-input
        border-top-right-radius 0
        border-bottom-right-radius 0

    .form-captcha
      position absolute
      width 112px
      height 32px
      right 0
      top 1px
      border-top-right-radius 2px
      border-bottom-right-radius 2px
      overflow hidden

      &-img
        display block
        width 100%
        height 100%

      .form-button
        margin-top 20px
</style>
