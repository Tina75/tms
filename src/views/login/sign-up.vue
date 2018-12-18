<template>
  <div class="form-body">
    <Card :bordered="false" style="height: 100%;">
      <div class="form-title">注册账号</div>

      <ul class="form-step">
        <li v-for="(item, key) in stepList"
            :key="key" style="flex-direction: column; -ms-flex-direction: column" class="form-step-item">
          <div :class="{'form-step-item-circle-active': step === key}" class="form-step-item-circle"><span>{{ key + 1 }}</span></div>
          <p :class="{'form-step-item-tip-active': step === key}" class="form-step-item-tip">{{item}}</p>
        </li>
      </ul>

      <div class="form-content">

        <Form ref="loginForm" :model="form" :rules="rules" @submit.native.prevent>
          <!-- step 1 -->
          <div v-if="step === 0" :key="0">
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
          </div>

          <!-- step 2 -->
          <div v-if="step === 1" :key="1">
            <FormItem prop="userName">
              <Input v-model="form.userName" :maxlength="10"
                     placeholder="输入联系人姓名" />
            </FormItem>
            <FormItem prop="name">
              <Input v-model="form.name" :maxlength="25" placeholder="输入公司名称" />
            </FormItem>
            <FormItem prop="address">
              <Row>
                <Col :span="8">
                <CitySelect v-model="form.cityId" clearable></CitySelect>
                </Col>
                <Col :span="16" class="areaRight">
                <AreaInput v-model="form.address" :city-code="cityCode" :maxlength="40" placeholder="输入公司详细地址" @latlongt-change="addressLocationChange"></AreaInput>
                </Col>
              </Row>
            </FormItem>
          </div>

          <!-- step 3 -->
          <div v-if="step === 2" :key="2">
            <FormItem prop="password">
              <Tooltip content="请输入6-16位非连续重复的数字、大小写字母" style="width: 100%;" transfer placement="top">
                <Input v-model="form.password" :maxlength="16" type="password" placeholder="设置登录密码" />
              </Tooltip>
            </FormItem>
            <FormItem prop="confirmPassword">
              <Input v-model="form.confirmPassword" :maxlength="16" type="password" placeholder="再次输入密码" />
            </FormItem>
          </div>
          <br/>
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
import CitySelect from '@/components/SelectInputForCity'

export default {
  name: 'SignUp',
  components: { AreaInput, CitySelect },
  mixins: [ BasePage, mixin ],
  metaInfo: {
    title: '注册账号'
  },
  data () {
    return {
      step: 0,
      stepList: ['验证手机号', '填写账号信息', '注册成功'],
      protocol: true,

      form: {
        phone: '',
        captchaCode: '',
        smsCode: '',
        password: '',
        confirmPassword: '',
        name: '', // 公司名称
        userName: '', // 联系人姓名
        address: '', // 公司地址
        cityId: void 0,
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
          { required: true, message: '公司地址不能为空' },
          { type: 'string', min: 5, max: 40, message: '公司地址不能少于5个字也不能超过40个字' }
        ],
        cityId: [{ required: true, message: '省市区不能为空' }]
      },

      cities: []
    }
  },
  computed: {
    cityCode () {
      return this.form.cityId
    }
  },
  created () {
    this.getCaptcha()
    this.cities = this.getCities()
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

          Server({
            url: '/user/register',
            method: 'post',
            data
          }).then(res => {
            this.$Message.success('注册成功')
            window.localStorage.removeItem('tms_is_login')
            setTimeout(() => {
              // this.changeMode('signin')
              this.$router.replace({ path: '/login' })
            }, 2000)
          }).catch(err => console.error(err))
        }
      })
    },

    // 查询省市区列表
    // TMS1.2 18.10.31 将城市数据修改为懒加载，初始化只加载省份，选择后再加载子城市，否则 IE & EDGE 上会出现严重卡顿
    getCities (code) {
      return City.getAllChild(code).map(item => {
        let temp = {
          value: item.code,
          label: item.name
        }
        if (Number(item.hasChild)) {
          temp.children = []
          temp.loading = false
        }
        return temp
      })
    },
    // 联级框加载更多
    loadChildCities (item, cb) {
      item.loading = true
      item.children = this.getCities(item.value)
      item.loading = false
      cb()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "./login.styl"

  .form-body
    width 800px
    height 540px
    position: absolute
    margin: auto
    top: 0
    right: 0
    bottom: 0
    left 0
    .form-content
      width 450px
      margin auto

    .form-step
      position relative
      display flex
      display: -ms-flexbox
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
        -ms-flex: 1
        flex-direction column
        -ms-flex-direction column
        align-items center
        -ms-flex-align center
        position relative
        z-index 1
        text-align: center

        &-circle
          width 50px
          height 50px
          background #FFFFFF
          display: inline-block

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
          display: inline-block
          width: 100%
          text-align: center

          &-active
            color #00A4BD
  .areaRight
    padding-left: 15px
    margin-top:1px
</style>
