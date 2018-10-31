<template>
  <div class="form-body">
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

        <Form ref="loginForm" :model="form" :rules="rules" @submit.native.prevent>
          <!-- step 1 -->
          <template v-if="step === 0">
            <FormItem prop="phone">
              <Input v-model="form.phone" :maxlength="11" placeholder="输入手机号" />
            </FormItem>

            <FormItem prop="captchaCode">
              <Input v-model="form.captchaCode" class="form-captcha-input" type="text" placeholder="输入验证码" />
              <div class="form-captcha">
                <img :src="captchaImage" class="form-captcha-img"
                     @click="getCaptcha">
              </div>
            </FormItem>

            <FormItem prop="smsCode">
              <Row>
                <Col :span="14">
                <Input v-model="form.smsCode" type="text" placeholder="输入手机验证码" />
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
              <Input v-model="form.userName" :maxlength="10"
                     placeholder="输入联系人姓名" />
            </FormItem>
            <FormItem prop="name">
              <Input v-model="form.name" :maxlength="25" placeholder="输入公司名称" />
            </FormItem>
            <FormItem prop="cityId">
              <Cascader :data="cities" v-model="form.cityId" placeholder="选择省/市/区"></Cascader>
            </FormItem>
            <FormItem prop="address">
              <AreaInput
                v-model="form.address"
                :city-code="cityCode"
                :maxlength="40"
                placeholder="输入公司详细地址"
                @latlongt-change="addressLocationChange" />
            </FormItem>
          </template>

          <!-- step 3 -->
          <template v-if="step === 2">
            <FormItem prop="password">
              <Tooltip content="密码只支持6-16位的数字、大小写字母" style="width: 100%;" placement="top">
                <Input v-model="form.password" :maxlength="16" type="password" placeholder="设置登录密码" />
              </Tooltip>
            </FormItem>
            <FormItem prop="confirmPassword">
              <Input v-model="form.confirmPassword" :maxlength="16" type="password" placeholder="再次输入密码" />
            </FormItem>
          </template>

          <FormItem>
            <Checkbox v-model="protocol" style="line-height: 1.5;">
              我已阅读并同意
              <a style="color: #418DF9;" @click.prevent="showProtocol(1)">《运掌柜TMS服务协议》</a>
              <a style="color: #418DF9;" @click.prevent="showProtocol(2)">《运掌柜TMS隐私协议》</a>
            </Checkbox>
            <Button type="primary" long
                    @click="nextStep">{{step === 2 ? '立即注册' : '下一步'}}</Button>
            <div>
              <a v-if="step" @click.prevent="step = step - 1">&lt;上一步</a>
              <p style="float: right;">已有账号？<a @click.prevent="changeMode('signin')">请登录&gt;</a></p>
            </div>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import BasePage from '@/basic/BasePage'
import Server from '@/libs/js/server'
import City from '@/libs/js/city'
import mixin from './mixin'
import { VALIDATOR_PHONE, VALIDATOR_PASSWORD, VALIDATOR_CONFIRM_PASSWORD } from './validator'

import AreaInput from '@/components/AreaInput'

export default {
  name: 'SignUp',
  components: { AreaInput },
  mixins: [ BasePage, mixin ],
  metaInfo: {
    title: '注册账号'
  },
  data () {
    return {
      step: 1,
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
        cityId: [],
        latitude: void 0,
        longitude: void 0,
        mapType: 1
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
        ],
        name: [
          { required: true, message: '公司名不能为空', trigger: 'blur' },
          { type: 'string', max: 25, message: '公司名不能超过25个字', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '联系人不能为空', trigger: 'blur' },
          { type: 'string', min: 2, max: 10, message: '联系人不能少于2个字也不能超过10个字', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '公司地址不能为空', trigger: 'blur' },
          { type: 'string', min: 5, max: 40, message: '公司地址不能少于5个字也不能超过40个字', trigger: 'blur' }
        ],
        cityId: [{ required: true, message: '省市区不能为空' }]
      },

      cities: []
    }
  },
  computed: {
    cityCode () {
      console.log(this.form.cityId[2] || void 0)
      return this.form.cityId[2] || void 0
    }
  },
  created () {
    this.getCaptcha()
    this.getCities()
  },
  methods: {
    showProtocol (type) {
      this.openDialog({
        name: 'login/protocol',
        data: { type }
      })
    },
    addressLocationChange ({ lat, lng }) {
      this.form.latitude = lat
      this.form.longitude = lng
    },
    // 下一步校验
    nextStep () {
      console.log(this.form)
      this.$refs.loginForm.validate(valid => {
        if (!valid) return

        if (this.step === 0) {
          this.imCheckPhone()
            .then(this.imCheckSMSCode)
            .then(() => {
              this.step++
            })
        } else if (this.step === 1) {
          this.step++
        } else {
          if (!this.protocol) {
            this.$Message.warning('请先阅读并同意《运掌柜TMS服务协议》《运掌柜TMS隐私协议》')
            return
          }

          let data = Object.assign({}, this.form)
          data.cityId = data.cityId[2]

          Server({
            url: '/user/register',
            method: 'post',
            data
          }).then(res => {
            this.$Message.success('注册成功')
            window.sessionStorage.setItem('signup_phone', data.phone)
            setTimeout(() => {
              this.changeMode('signin')
            }, 2000)
          }).catch(err => console.error(err))
        }
      })
    },

    // companyNameRuleToast (e) {
    //   if (e.keyCode === 8 || e.keyCode === 46) return // backspace & delete
    //   if (this.form.name.length === 25) this.$Message.warning('公司名不能超过25个字')
    // },

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
    height 540px
    left 50%
    top 50%
    transform translate(-50%, -50%)

    .form-content
      width 300px
      margin auto

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
        height 1px
        left 15%
        top 35%
        border-top 1px dashed #9DA1B0
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
