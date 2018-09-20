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
                <img :src="captchaImage" class="form-captcha-img"
                     @click="getCaptcha">
              </div>
            </FormItem>

            <FormItem prop="smsCode">
              <Row>
                <Col :span="14">
                <Input v-model="form.smsCode" type="text" placeholder="输入手机验证码"
                       @on-blur="inputBlur('smsCode')" />
                </Col>
                <Col :span="9" :offset="1">
                <Button :disabled="!captchaEnable" long
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
                     @on-blur="inputBlur('name')"
                     @on-keydown="companyNameRuleToast" />
            </FormItem>
            <FormItem prop="location">
              <Cascader :data="cities" v-model="location" placeholder="选择省/市/区"
                        @on-change="locationChange"
                        @on-visible-change="locationBlur"></Cascader>
            </FormItem>
            <FormItem prop="address">
              <Input v-model="form.address" :maxlength="40" placeholder="输入公司详细地址"
                     @on-blur="inputBlur('address')" />
            </FormItem>
          </template>

          <!-- step 3 -->
          <template v-if="step === 2">
            <FormItem prop="password">
              <Tooltip content="密码只支持6-16位的数字、大小写字母" style="width: 100%;" placement="top">
                <Input v-model="form.password" :maxlength="16" type="password" placeholder="设置登录密码"
                       @on-blur="inputBlurWithPw" />
              </Tooltip>
            </FormItem>
            <FormItem prop="confirmPassword">
              <Input v-model="form.confirmPassword" :maxlength="16" type="password" placeholder="再次输入密码"
                     @on-blur="inputBlur('confirmPassword')" />
            </FormItem>
          </template>

          <FormItem>
            <Checkbox v-model="protocol" style="line-height: 1.3;">
              我已阅读并同意
              <a @click.prevent="showProtocol(1)">《智加云TMS服务协议》</a>
              <a @click.prevent="showProtocol(2)">《智加云TMS隐私协议》</a>
            </Checkbox>
            <Button class="form-button" type="primary" long
                    @click="nextStep">{{step === 2 ? '立即注册' : '下一步'}}</Button>
            <p style="text-align: center;">已有账号？<a @click.prevent="changeMode('signin')">请登录></a></p>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import City from '@/libs/js/City'
import mixin from './mixin'

export default {
  name: 'SignUp',
  mixins: [ BasePage, mixin ],
  metaInfo: {
    title: '注册账号'
  },
  data () {
    return {
      step: 0,
      stepList: ['验证手机号', '填写账号信息', '注册成功'],
      protocol: true,
      showP: 0,

      form: {
        phone: '',
        captchaCode: '',
        smsCode: '',
        password: '',
        confirmPassword: '',
        name: '', // 公司名称
        userName: '', // 联系人姓名
        address: '', // 公司地址
        cityId: ''
      },
      location: [], // 所在省市区

      cities: []
    }
  },
  watch: {
    location () {
      this.form.cityId = this.location[this.location.length - 1]
    }
  },
  created () {
    this.getCaptcha()
    this.getCities()
  },
  methods: {
    showProtocol (type) {
      console.log(type)
      this.openDialog({
        name: 'login/protocol',
        data: { type }
      })
    },
    // 下一步校验
    nextStep () {
      let validParams
      if (this.step === 0) {
        validParams = ['phone', 'captchaCode', 'smsCode']
      } else if (this.step === 1) {
        validParams = ['userName', 'name', 'cityId', 'address']
      } else {
        validParams = this.form
      }

      for (let index in validParams) {
        const key = validParams[index]
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

      if (!this.protocol) {
        this.$Message.warning('请先阅读并同意《智加云TMS服务协议》《智加云TMS隐私协议》')
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
    },

    companyNameRuleToast (e) {
      if (e.keyCode === 8 || e.keyCode === 46) return // backspace & delete
      if (this.form.name.length === 25) this.$Message.warning('公司名不能超过25个字')
    },

    // 省市区选择改变
    locationChange (value, data) {
      this.cityId = value[value.length - 1]
    },

    // 省市区选择失焦
    locationBlur (open) {
      if (!open && !this.cityId) this.inputBlur('cityId')
    },

    // 查询城市列表
    getCities () {
      this.cities = walk()
      function walk (code) {
        return City.getAllChild(code).map(item => {
          let temp = {
            value: item.code,
            label: item.name
          }
          if (item.hasChild) temp.children = walk(item.code)
          return temp
        })
      }
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
