import Server from '@/libs/js/server'

const WAITING_TIME = 60
const CAPTCHA_URL = process.env.VUE_APP_HOST + 'user/captcha'

export default {
  replace: true,
  data () {
    return {
      timer: void 0,
      captchaImage: '', // 图片验证码
      captchaEnable: true,
      intervalSeconds: WAITING_TIME
    }
  },
  created () {
    this.form.phone = this.$store.getters.phone
  },
  methods: {
    changeMode (mode) {
      this.$store.commit('USER_PHONE', this.form.phone)
      this.$emit('on-change', mode)
    },

    // 实时校验手机号
    imCheckPhone (mode) {
      return new Promise((resolve, reject) => {
        Server({
          url: '/user/phone',
          method: 'get',
          data: { phone: this.form.phone }
        }).then(res => {
          if (mode === 'signup' && res.data.code === 310013) {
            this.$Message.error('该手机号已注册，请登录')
            reject && reject(new Error('该手机号已注册，请登录'))
          } else if (mode === 'signin' && res.data.code === 10000) {
            this.$Message.error('该手机号未注册，请先注册')
            reject && reject(new Error('该手机号未注册，请先注册'))
          } else if (mode === 'findback' && res.data.code === 10000) {
            this.$Message.error('该手机号未注册，请先注册')
            reject && reject(new Error('该手机号未注册，请先注册'))
          }
          resolve()
        }).catch(err => console.error(err))
      })
    },

    // 实时校验图形验证码
    imCheckCapthcha () {
      return new Promise((resolve, reject) => {
        Server({
          url: '/user/testCaptcha',
          method: 'get',
          data: { captchaCode: this.form.captchaCode }
        }).then(res => {
          console.log('图形验证码校验通过')
          resolve()
        }).catch(err => {
          console.error(err)
          this.getCaptcha()
        })
      })
    },

    // 实时校验短信验证码
    imCheckSMSCode () {
      return new Promise((resolve, reject) => {
        Server({
          url: '/user/smsCode',
          method: 'get',
          data: {
            phone: this.form.phone,
            smsCode: this.form.smsCode
          }
        }).then(res => {
          console.log('短信验证码校验通过')
          resolve()
        }).catch(err => {
          console.error(err)
          this.getCaptcha()
        })
      })
    },

    // 获取图片验证码
    getCaptcha () {
      this.captchaImage = `${CAPTCHA_URL}?${new Date().getTime()}`
    },

    // 发送手机验证码
    sendSMS (url) {
      const promises = ['phone', 'captchaCode'].map(prop => {
        return new Promise((resolve, reject) => {
          this.$refs.loginForm.validateField(prop, error => {
            if (error) reject(new Error(error))
            resolve()
          })
        })
      })
      Promise.all(promises)
        .then(() => {
          const data = {
            phone: this.form.phone,
            captchaCode: this.form.captchaCode
          }

          Server({
            url,
            method: 'get',
            data
          }).then(res => {
            this.$Message.success('短信验证码已发送至手机，请注意查收')
            this.captchaEnable = false
            this.timer = setInterval(() => {
              if (this.intervalSeconds > 1) this.intervalSeconds--
              else {
                this.intervalSeconds = WAITING_TIME
                this.captchaEnable = true
                clearInterval(this.timer)
              }
            }, 1000)
          }).catch(err => {
            this.getCaptcha()
            console.error(err)
          })
        })
    }
  }

}
