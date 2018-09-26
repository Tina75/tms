<template>
  <div id="app" class="login">
    <header class="login-header">
      <i class="icon font_family icon-logo-p"></i>
      <div class="login-header-tel">
        <p>400-788-5656</p>
        <p>客服电话</p>
      </div>
    </header>

    <div :class="{'login-bg': mode === 'signin'}"
         class="login-body">
      <Signin v-if="mode === 'signin'"
              @on-change="modeChange" />
      <Signup v-if="mode === 'signup'"
              @on-change="modeChange" />
      <FindBack v-if="mode === 'findback'"
                @on-change="modeChange" />
    </div>

    <footer class="login-footer">
      版权所有·智加云 Copyright &#169; 2018 5566.com All Rights Reserved
    </footer>
    <Dialogs />
  </div>
</template>

<script>
import Dialogs from '@/components/Dialogs'
import Signin from '@/views/login/index'
import Signup from '@/views/login/sign-up'
import FindBack from '@/views/login/find-back'

export default {
  name: 'Login',
  components: { Dialogs, Signin, Signup, FindBack },
  data () {
    return {
      mode: 'signin'
    }
  },
  methods: {
    modeChange (mode) {
      this.mode = mode
    }
  }
}
</script>

<style lang="stylus" scoped>
  .icon
    color #FFFFFF
    font-size 50px

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
      min-height 552px
      height calc( 100% - 216px )

    &-bg
      background url("./assets/bg-tms-login.png") no-repeat
      background-size cover
      background-position center center

</style>
