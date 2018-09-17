import Server from '@/libs/js/server'

let timer
let waitingTime = 5

let captchaUrl
switch (process.env.NODE_ENV) {
  case 'development':
    captchaUrl = 'http://192.168.1.49:5656/dolphin-web/user/captcha'; break
  case 'production':
    captchaUrl = '//dev-boss.yundada56.com/bluewhale-boss/user/captcha'; break
}

export default {
  replace: true,
  data () {
    return {
      captchaImage: '', // 图片验证码
      captchaEnable: true,
      intervalSeconds: waitingTime
    }
  },
  methods: {
    // 输入框校验
    validate (type, { extraRules, done } = {}) {
      switch (type) {
        case 'phone':
          if (!this.form.phone.length) {
            this.$Message.error('手机号不能为空')
            return false
          } else if (this.form.phone.length !== 11 || this.form.phone[0] !== '1' || isNaN(Number(this.form.phone))) {
            this.$Message.error('手机号格式不正确，请重输')
            return false
          }
          break
        case 'password':
          if (!this.form.password.length) {
            this.$Message.error('密码不能为空')
            return false
          }
          break
        case 'confirmPassword':
          if (!this.form.confirmPassword.length) {
            this.$Message.error('确认密码不能为空')
            return false
          }
          if (this.form.password !== this.form.confirmPassword) {
            this.$Message.error('前后两次密码不一致')
            return false
          }
          break
        case 'captchaCode':
          if (!this.form.captchaCode.length) {
            this.$Message.error('图形验证码不能为空')
            return false
          }
          break
        case 'smsCode':
          if (!this.form.smsCode.length) {
            this.$Message.error('验证码不能为空')
            return false
          }
          break
        case 'name':
          if (!this.form.name.length) {
            this.$Message.error('公司名不能为空')
            return false
          }
          break
        case 'userName':
          if (!this.form.userName.length) {
            this.$Message.error('联系人不能为空')
            return false
          }
          break
        case 'address':
          if (!this.form.address.length) {
            this.$Message.error('公司地址不能为空')
            return false
          }
          if (this.form.address.length > 40 || this.form.address.length < 5) {
            this.$Message.error('公司地址不能少于5个字也不能超过40个字')
            return false
          }
          break
        case 'cityId':
          if (!this.form.cityId.length) {
            this.$Message.error('省市区不能为空')
            return false
          }
          break
        default: break
      }
      let valid = true
      if (extraRules) valid = extraRules()
      done && done()
      return valid
    },

    // 输入框失焦
    inputBlur (type) {
      if (this.currentFocus !== undefined) this.currentFocus = ''
      if (!this.validate(type)) return

      if (type === 'phone' && this.$route.path === '/login/sign-up') this.imCheckPhoneIsSignup()
      else if (type === 'captchaCode') this.imCheckCapthcha()
      else if (type === 'smsCode') this.imCheckSMSCode()
    },

    // 校验密码-添加设置密码时的位数规则
    inputBlurWithPw () {
      return this.validate('password', {
        extraRules: () => {
          if (this.form.password.length > 16 || this.form.password.length < 6) {
            this.$Message.error('密码格式不正确，至少6位，至多16位')
            return false
          }
          return true
        }
      })
    },

    // 实时校验手机号是否已注册
    imCheckPhoneIsSignup () {
      Server({
        url: '/user/phone',
        method: 'get',
        data: { phone: this.form.phone }
      }).then(res => {
        console.log('手机号校验通过')
      }).catch(err => console.error(err))
    },

    // 实时校验图形验证码
    imCheckCapthcha () {
      Server({
        url: '/user/testCaptcha',
        method: 'get',
        data: { captchaCode: this.form.captchaCode }
      }).then(res => {
        console.log('图形验证码校验通过')
      }).catch(err => {
        console.error(err)
        this.getCaptcha()
      })
    },

    // 实时校验短信验证码
    imCheckSMSCode () {
      Server({
        url: '/user/smsCode',
        method: 'get',
        data: {
          phone: this.form.phone,
          smsCode: this.form.smsCode
        }
      }).then(res => {
        console.log('短信验证码校验通过')
      }).catch(err => console.error(err))
    },

    // 获取图片验证码
    getCaptcha () {
      this.captchaImage = `${captchaUrl}?${new Date().getTime()}`
    },

    // 发送手机验证码
    sendSMS (url) {
      const data = {
        phone: this.form.phone,
        captchaCode: this.form.captchaCode
      }
      for (let key in data) {
        if (!this.validate(key)) return
      }
      Server({
        url,
        method: 'get',
        data
      }).then(res => {
        this.$Message.success('短信验证码已发送至手机，请注意查收')
        this.captchaEnable = false
        timer = setInterval(() => {
          if (this.intervalSeconds > 1) this.intervalSeconds--
          else {
            this.intervalSeconds = waitingTime
            this.captchaEnable = true
            clearInterval(timer)
          }
        }, 1000)
      }).catch(err => console.error(err))
    }
  }

}
