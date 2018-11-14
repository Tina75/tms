<template>
  <div id="app" class="login">
    <header class="login-header">
      <i class="icon font_family icon-logo-p"></i>
      <div class="login-header-tel">
        <p>025-66606056</p>
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
      版权所有-南京智加云信息科技  Copyright © 2018 tms5566.com  All Rights Reserved
      <a target="_blank" href="http://www.miitbeian.gov.cn">苏ICP备18054987号</a>
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32010402000567">
        <img src="./assets/copyright.jpg" style="height:16px;line-height:16px;margin:0 5px"/>苏公安网备 32010402000567号
      </a>
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
      phone: '',
      mode: ['signin', 'signup', 'findback'].indexOf(this.$route.query.mode) > -1 ? this.$route.query.mode : 'signin'
    }
  },
  methods: {
    modeChange (mode) {
      this.mode = mode
    }
  }
}
</script>

<style lang="stylus">
  .login
    position relative
    width 100%
    height 100%
    background #1c2125
    overflow auto

    ul
      list-style none

    // .ivu-input,
    // .ivu-btn
    //   height 35px
    // .ivu-input-prefix i
    //   line-height 35px

    .icon-logo-p
      color #FFFFFF
      font-size 40px

    &-header
      display flex
      display -ms-flexbox
      align-items center
      -ms-flex-align center
      justify-content space-between
      -ms-flex-pack justify
      height 88px
      padding 0 43px 0 143px
      border-bottom 1px solid #3A424B

      &-tel
        flex none
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
      color rgba(255, 255, 255, 0.6)
      text-align center
      background #1c2125

    &-body
      position relative
      min-height 552px
      height calc( 100% - 246px )

    &-bg
      background url("./assets/bg-tms-login.png") no-repeat
      background-size cover
      background-position center center
</style>
