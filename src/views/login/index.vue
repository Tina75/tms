
<template>
  <div class="login-con" @keydown.enter="handleSubmit">
    <Card :bordered="false">
      <p slot="title">
        <Icon type="log-in"/>
        欢迎登录
      </p>
      <div class="form-con">
        <Form ref="loginForm" :model="form" :rules="rules">
          <FormItem prop="telephone">
            <Input v-model="form.telephone" placeholder="请输入用户手机号">
            <Icon slot="prefix" type="ios-contact" />
            </Input>
          </FormItem>
          <FormItem prop="captcha">
            <Row>
              <Col :span="13">
              <Input v-model="form.captcha" type="text" placeholder="请输入验证码">
              <Icon slot="prefix" type="ios-chatbubbles" />
                </Input>
              </Col>
              <Col :span="9" :offset="1">
              <Button  :disabled="!captchaEnable" @click="getCaptcha">{{captchaEnable?`&nbsp;&nbsp;&nbsp;获取验证码&nbsp;&nbsp;&nbsp;`:intervalSeconds+'秒后可重试'}}</Button>
                <!-- <Button :size="buttonSize" >90s后重新获取</Button> -->
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <i-button type="primary" long @click="login">登录</i-button>
          </FormItem>
          <FormItem style="text-align: right;">
            <router-link to="/login/sign-up" style="margin-right: 20px;">用户注册</router-link>
            <router-link to="/login/find-back">忘记密码</router-link>
          </FormItem>
        </Form>
        <p class="login-tip">运达达运输管理系统</p>
      </div>
    </Card>
  </div>
</template>

<script>
import Server from '@/libs/js/server.js'
export default {
  name: 'SignIn',
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
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { max: 11, min: 11, trigger: 'blur', message: '手机格式有误' }
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
        data: { phone: this.form.telephone }
      })
        .then(({ data }) => {
          this.captchaEnable = false
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
