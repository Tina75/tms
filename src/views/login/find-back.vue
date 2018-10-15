<template>
  <div class="form-body">
    <Card :bordered="false" style="height: 100%;">
      <div class="form-title">忘记密码</div>
      <div class="form-content">
        <Form ref="loginForm" :model="form" :rules="rules" @submit.native.prevent>

          <FormItem prop="phone">
            <Input v-model="form.phone" :maxlength="11" placeholder="请输入用户手机号" />
          </FormItem>

          <FormItem prop="captchaCode">
            <Input v-model="form.captchaCode" class="form-captcha-input" type="text" placeholder="输入验证码" />
            <div class="form-captcha">
              <img v-if="captchaImage" :src="captchaImage" class="form-captcha-img" @click="getCaptcha">
            </div>
          </FormItem>

          <FormItem prop="smsCode">
            <Row>
              <i-col :span="14">
                <Input v-model="form.smsCode" type="text" placeholder="请输入验证码" />
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
              <Input v-model="form.password" :maxlength="16" type="password" placeholder="密码" />
            </Tooltip>
          </FormItem>

          <FormItem prop="confirmPassword">
            <Input v-model="form.confirmPassword" :maxlength="16" type="password" placeholder="确认密码" />
          </FormItem>

          <FormItem class="form-button">
            <Button type="primary" long @click="handleSubmit">确定</Button>
            <p style="float: right; margin-top: 20px;"><a @click.prevent="changeMode('signin')">去登录&gt;</a></p>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import mixin from './mixin'
import { VALIDATOR_PHONE, VALIDATOR_PASSWORD, VALIDATOR_CONFIRM_PASSWORD } from './validator'

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
      },

      rules: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: VALIDATOR_PHONE, trigger: 'blur' }
        ],
        captchaCode: [{ required: true, message: '图形验证码不能为空', trigger: 'blur' }],
        smsCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: VALIDATOR_PASSWORD, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: VALIDATOR_CONFIRM_PASSWORD, trigger: 'blur', vm: this }
        ]
      }
    }
  },
  created () {
    this.getCaptcha()
  },
  methods: {
    // 提交
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return

        Server({
          url: '/user/forgetpsw',
          method: 'post',
          data: {
            phone: this.form.phone,
            smsCode: this.form.smsCode,
            password: this.form.password,
            confirmPassword: this.form.confirmPassword,
            code: this.code
          }
        }).then(res => {
          this.$Message.success('密码设置成功')
          setTimeout(() => {
            this.changeMode('signin')
          }, 2000)
        }).catch(err => console.error(err))
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "./login.styl"

  .form-body
    width 800px
    height 530px
    left 50%
    top 50%
    transform translate(-50%, -50%)

    .form-content
      width 300px
      margin 24px auto
</style>
