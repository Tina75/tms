
<template>
  <div id="app" class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"/>
          欢迎登录
        </p>
        <div class="form-con">
          <i-form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="telephone">
              <i-input v-model="form.telephone" placeholder="请输入用户手机号">
                <Icon slot="prefix" type="ios-contact" />
              </i-input>
            </FormItem>
            <FormItem prop="captcha">
              <Row>
                <i-col :span="13">
                  <i-input v-model="form.captcha" type="text" placeholder="请输入验证码">
                    <Icon slot="prefix" type="ios-chatbubbles" />
                  </i-input>
                </i-col>
                <i-col :span="9" :offset="1">
                  <Button  :disabled="!captchaEnable" @click="getCaptcha">{{captchaEnable?`&nbsp;&nbsp;&nbsp;获取验证码&nbsp;&nbsp;&nbsp;`:intervalSeconds+'秒后可重试'}}</Button>
                  <!-- <Button :size="buttonSize" >90s后重新获取</Button> -->
                </i-col>
              </Row>
            </FormItem>
            <FormItem>
              <i-button type="primary" long @click="login">登录</i-button>
            </FormItem>
          </i-form>
          <p class="login-tip">运达达运输管理系统</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Server from './libs/js/server.js'
export default {
  name: 'Login',
  metaInfo: {
    title: '登录'
  },
  data () {
    return {
      captchaEnable: true,
      timer: null,
      intervalSeconds: 90,
      form: {
        telephone: '',
        captcha: ''
      },
      rules: {
        telephone: [
          {required: true, message: '用户名不能为空', trigger: 'blur'},
          {max: 11, min: 11, trigger: 'blur', message: '手机格式有误'}
        ],
        captcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { max: 6, min: 6, trigger: 'blur', message: '验证码格式有误' }
        ]
      }
    }
  },
  watch: {
    captchaEnable: function (value) {
      if (!value) {
        this.timer = setInterval(() => {
          this.intervalSeconds--
          if (!this.intervalSeconds) {
            this.captchaEnable = true
            this.intervalSeconds = 90
            clearInterval(this.timer)
          }
        }, 1000)
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.login()
        }
      })
    },
    login () {
      window.localStorage.setItem('tms_is_login', true)
      location.reload()
    },
    getCaptcha () {
      if (!this.form.telephone || this.form.telephone.length !== 11) {
        return this.$Message.error('手机号码格式有误')
      }
      Server({
        url: 'loginsmscaptcha',
        method: 'post',
        data: {phone: this.form.telephone}
      }).then(({data}) => {
        this.captchaEnable = false
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="stylus">
  .login
    width 100%
    height 100%
    background-image url('https://file.iviewui.com/iview-admin/login_bg.jpg')
    background-size cover
    background-position center
    position relative
    &-con
      position absolute
      right 160px
      top 50%
      transform translateY(-60%)
      width 300px
      &-header
        font-size 16px
        font-weight 300
        text-align center
        padding 30px 0
      .form-con
        padding 10px 0 0
      .login-tip
        font-size 10px
        text-align center
        color #c3c3c3

</style>
