<template>
  <div class="form-body" @keydown.enter="handleSubmit">
    <Card :bordered="false" style="height: 100%;">
      <div class="form-title">忘记密码</div>
      <div class="form-content">
        <Form ref="loginForm" :model="form">

          <FormItem prop="phone">
            <Input v-model="form.phone" :maxlength="11" placeholder="请输入用户手机号"
                   @on-blur="inputBlur('phone')" />
          </FormItem>

          <FormItem prop="captchaCode">
            <Input v-model="form.captchaCode" class="form-captcha-input" type="text" placeholder="输入验证码"
                   @on-blur="inputBlur('captchaCode')" />
            <div class="form-captcha">
              <img :src="captchaImage" class="form-captcha-img" @click="getCaptcha">
            </div>
          </FormItem>

          <FormItem prop="smsCode">
            <Row>
              <i-col :span="14">
                <Input v-model="form.smsCode" type="text" placeholder="请输入验证码"
                       @on-blur="inputBlur('smsCode')" />
              </i-col>
              <i-col :span="9" :offset="1">
                <Button :disabled="!captchaEnable"
                        long
                        @click="sendSMS('/user/forpswsms')">{{captchaEnable?`&nbsp;&nbsp;&nbsp;获取验证码&nbsp;&nbsp;&nbsp;`:intervalSeconds+'秒后可重试'}}</Button>
              </i-col>
            </Row>
          </FormItem>

          <FormItem prop="password">
            <Tooltip content="密码只支持6-16位的数字、大小写字母" style="width: 100%;" placement="top">
              <Input v-model="form.password" :maxlength="16" type="password" placeholder="密码"
                     @on-blur="inputBlurWithPw" />
            </Tooltip>
          </FormItem>

          <FormItem prop="confirmPassword">
            <Input v-model="form.confirmPassword" :maxlength="16" type="password" placeholder="确认密码"
                   @on-blur="inputBlur('confirmPassword')" />
          </FormItem>

          <FormItem>
            <Button class="form-button" type="primary" long @click="handleSubmit">确定</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import mixin from './mixin'

export default {
  name: 'FindBack',
  mixins: [ mixin ],
  metaInfo: {
    title: '忘记密码'
  },
  data () {
    return {
      form: {
        phone: '',
        captchaCode: '',
        smsCode: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    // 提交
    handleSubmit () {
      for (let key in this.form) {
        if (key !== 'password') {
          if (!this.validate(key)) return
        } else {
          if (!this.inputBlurWithPw(key)) return
        }
      }

      Server({
        url: '/user/forgetpsw',
        method: 'post',
        data: this.form
      }).then(res => {
        this.$Message.success('密码设置成功')
        setTimeout(() => {
          this.changeMode('signin')
        }, 2000)
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "./login.styl"

  .form-body
    width 800px
    height 520px
    left 50%
    top 50%
    transform translate(-50%, -50%)

    .form-content
      width 300px
      margin 24px auto
</style>
