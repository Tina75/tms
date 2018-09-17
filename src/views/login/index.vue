<template>
  <div class="login-signin">
    <img class="login-img" src="@/assets/img-tms-login.png"></img>
    <div class="form-body" @keydown.enter="login">
      <Card :bordered="false">
        <div class="form-title">智加云账号登录</div>
        <div class="form-content">
          <Form ref="loginForm" :model="form">

            <FormItem prop="phone">
              <Input v-model="form.phone" :maxlength="11" placeholder="登录账号/手机号"
                     @on-focus="inputFocus('phone')"
                     @on-blur="inputBlur('phone')">
              <Icon slot="prefix" :color="inputIconColor('phone')" type="ios-contact" />
              </Input>
            </FormItem>

            <FormItem prop="password">
              <Input v-model="form.password" type="password" placeholder="输入密码"
                     @on-focus="inputFocus('password')"
                     @on-blur="inputBlur('password')">
              <Icon slot="prefix" :color="inputIconColor('password')" type="ios-contact" />
              </Input>
            </FormItem>

            <FormItem prop="captchaCode">
              <Input v-model="form.captchaCode" class="form-captcha-input" type="text" placeholder="输入验证码"
                     @on-focus="inputFocus('captchaCode')"
                     @on-blur="inputBlur('captchaCode')">
              <Icon slot="prefix" :color="inputIconColor('captchaCode')" type="ios-contact" />
              </Input>
              <div class="form-captcha">
                <img :src="captchaImage" class="form-captcha-img" >
              </div>
            </FormItem>

            <FormItem>
              <Button class="form-button" type="primary" long @click="login">登录</Button>

              <ul class="form-action">
                <li class="form-action-item">
                  <Checkbox v-model="rememberPW">记住密码</Checkbox>
                </li>
                <li class="form-action-item" style="text-align: center;">
                  <router-link to="/login/sign-up">立即注册</router-link>
                </li>
                <li class="form-action-item" style="text-align: right;">
                  <router-link to="/login/find-back" style="color: inherit;">忘记密码？</router-link>
                </li>
              </ul>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import mixin from './mixin'

export default {
  name: 'SignIn',
  mixins: [ mixin ],
  metaInfo: {
    title: '智加云账号登录'
  },
  data () {
    return {
      // 表单数据
      form: {
        phone: '',
        password: '',
        captchaCode: ''
      },

      currentFocus: '', // 当前聚焦的输入框类型
      rememberPW: false // 记住密码
    }
  },
  created () {
    this.localPwParser()
    this.getCaptcha()
  },
  methods: {
    // 输入框聚焦改变图标颜色
    inputIconColor (type) {
      return this.currentFocus === type ? '#00A4BD' : '#9DA1B0'
    },

    // 输入框聚焦
    inputFocus (type) {
      this.currentFocus = type
    },

    // 记住密码-解析密码
    localPwParser () {
      const encodePW = window.localStorage.local_rememberd_pw
      if (!encodePW) return
      const storeTime = 60 * 24 * 60 * 60 * 1000 // 记住密码的时长
      const decodePW = window.atob(encodePW).split('/')
      if ((new Date().getTime()) > Number(decodePW[2]) + storeTime) {
        window.localStorage.removeItem('local_rememberd_pw')
        return
      }
      this.form.phone = decodePW[0]
      this.form.password = decodePW[1]
      this.rememberPW = true
    },

    // 记住密码-保存密码
    // 密码保存加密规则：手机号/密码/时间戳 组成的字符串base64加密
    localPwSave () {
      const localPW = [this.form.phone, this.form.password, new Date().getTime()].join('/')
      const encodePW = window.btoa(localPW)
      window.localStorage.setItem('local_rememberd_pw', encodePW)
    },

    // 登录处理
    login () {
      for (let key in this.form) {
        if (!this.validate(key)) return
      }

      Server({
        url: '/user/login',
        method: 'post',
        data: this.form
      }).then(res => {
        if (this.rememberPW) this.localPwSave()
        else window.localStorage.removeItem('local_rememberd_pw')
        window.localStorage.setItem('tms_is_login', true)
        location.reload()
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "./login.styl"

  .login-signin
    display flex
    align-items center
    justify-content center

    &:before, &:after
      content ""
      display block
      position absolute
      top 0
      z-index 0
    &:before
      width 133px
      height 181px
      left 0
      background url("../../assets/img-login-bubble-left.png") no-repeat
      background-size contain
    &:after
      width 112px
      height 140px
      right 0
      background url("../../assets/img-login-bubble-right.png") no-repeat
      background-size contain

  .login-img
    display block
    position relative
    width 500px
    margin-right 107px
    z-index 1

  .form-body
    position relative
    width 380px
    z-index 1

    .form-content
      margin-bottom 0

    .form-prepend-icon
        width 32px
        height 32px
        line-height 32px
        margin -5px -7px
        font-size 16px

    .form-action
      display flex
      align-items space-between

      &-item
        flex 1
</style>
