<template>
  <div class="form-body" @keydown.enter="nextStep">
    <Card :bordered="false" style="height: 100%;">
      <div class="form-title">注册账号</div>

      <ul class="form-step">
        <li v-for="(item, key) in stepList"
            :key="key" class="form-step-item">
          <div :class="{'form-step-item-circle-active': step === key}" class="form-step-item-circle"><span>{{ key + 1 }}</span></div>
          <p :class="{'form-step-item-tip-active': step === key}" class="form-step-item-tip">{{item}}</p>
        </li>
      </ul>

      <div class="form-content">

        <Form ref="loginForm" :model="form">
          <!-- step 1 -->
          <template v-if="step === 0">
            <FormItem prop="phone">
              <Input v-model="form.phone" :maxlength="11" placeholder="输入手机号"
                     @on-blur="inputBlur('phone')" />
            </FormItem>

            <FormItem prop="captchaCode">
              <Input v-model="form.captchaCode" class="form-captcha-input" type="text" placeholder="输入验证码"
                     @on-blur="inputBlur('captchaCode')" />
              <div class="form-captcha">
                <img :src="captchaImage" class="form-captcha-img" >
              </div>
            </FormItem>

            <FormItem prop="smsCode">
              <Row>
                <Col :span="14">
                <Input v-model="form.smsCode" type="text" placeholder="输入手机验证码"
                       @on-blur="inputBlur('smsCode')" />
                </Col>
                <Col :span="9" :offset="1">
                <Button :disabled="!captchaEnable"
                        long
                        @click="sendSMS('/user/sms')">{{captchaEnable?`&nbsp;&nbsp;&nbsp;获取验证码&nbsp;&nbsp;&nbsp;`:intervalSeconds+'秒后可重试'}}</Button>
                </Col>
              </Row>
            </FormItem>
          </template>

          <!-- step 2 -->
          <template v-if="step === 1">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="输入联系人姓名"
                     @on-blur="inputBlur('userName')" />
            </FormItem>
            <FormItem prop="name">
              <Input v-model="form.name" :maxlength="25" placeholder="输入公司名称"
                     @on-blur="inputBlur('name')" />
            </FormItem>
            <FormItem prop="cityId">
              <Cascader :data="[]" v-model="form.cityId" placeholder="选择省/市/区"
                        @on-blur="inputBlur('cityId')"></Cascader>
            </FormItem>
            <FormItem prop="address">
              <Input v-model="form.address" :maxlength="40" placeholder="输入公司详细地址"
                     @on-blur="inputBlur('address')" />
            </FormItem>
          </template>

          <!-- step 3 -->
          <template v-if="step === 2">
            <FormItem prop="password">
              <Input v-model="form.password" :maxlength="16" type="password" placeholder="设置登录密码"
                     @on-blur="inputBlurWithPw" />
            </FormItem>
            <FormItem prop="confirmPassword">
              <Input v-model="form.confirmPassword" :maxlength="16" type="password" placeholder="再次输入密码"
                     @on-blur="inputBlur('confirmPassword')" />
            </FormItem>
          </template>

          <FormItem>
            <Button class="form-button" type="primary" long
                    @click="nextStep">{{step === 2 ? '立即注册' : '下一步'}}</Button>
            <p style="text-align: right;">已有账号？<router-link to="/">请登录></router-link></p>
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
  name: 'SignUp',
  mixins: [ mixin ],
  metaInfo: {
    title: '注册账号'
  },
  data () {
    return {
      step: 0,
      stepList: ['验证手机号', '填写账号信息', '注册成功'],

      form: {
        phone: '',
        captchaCode: '',
        smsCode: '',
        password: '',
        confirmPassword: '',
        name: '', // 公司名称
        userName: '', // 联系人姓名
        address: '', // 公司地址
        location: [], // 所在省市区
        cityId: ''
      }
    }
  },
  methods: {
    nextStep () {
      let validParams
      if (this.step === 0) {
        validParams = ['phone', 'captchaCode', 'smsCode']
      } else if (this.step === 1) {
        validParams = ['name', 'userName', 'cityId', 'address']
      } else {
        validParams = this.form
      }

      for (let key in validParams) {
        if (key !== 'password') {
          if (!this.validate(key)) return
        } else {
          if (!this.inputBlurWithPw(key)) return
        }
      }

      if (this.step !== 2) {
        this.step++
        return
      }
      Server({
        url: '/user/register',
        method: 'post',
        data: validParams
      }).then(res => {
        this.$Message.success('注册成功')
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style lang="stylus" scoped>
  .form-body
    width 800px
    height 520px
    left 50%
    top 50%
    transform translate(-50%, -50%)

    .form-content
      width 300px
      margin 24px auto

    .form-step
      position relative
      display flex
      align-items space-between
      width 500px
      margin 30px auto

      &:before
        content ""
        position absolute
        display block
        width 70%
        height 4px
        left 15%
        top 35%
        border-top 2px dashed #9DA1B0
        z-index 0

      &-item
        flex 1
        display flex
        flex-direction column
        align-items center
        position relative
        z-index 1

        &-circle
          width 50px
          height 50px
          background #FFFFFF

          span
            display block
            width 30px
            height 30px
            margin 10px
            border-radius 50%
            border 1px solid #9DA1B0
            text-align center
            line-height 30px
            font-size 20px
            color #9DA1B0

          &-active span
            color #FFFFFF
            background #00A4BD
            border-color #00A4BD

        &-tip
          font-size 12px
          color #9DA1B0

          &-active
            color #00A4BD
</style>
