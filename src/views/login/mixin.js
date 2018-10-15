import Server from '@/libs/js/server'

let timer
const waitingTime = 60

export default {
  replace: true,
  data () {
    return {
      captchaImage: '', // 图片验证码
      captchaEnable: true,
      code: '',
      intervalSeconds: waitingTime
    }
  },
  methods: {
    changeMode (mode) {
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
          data: {
            captchaCode: this.form.captchaCode,
            code: this.code
          }
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
      Server({
        url: '/user/captcha',
        method: 'get',
        responseType: 'arraybuffer'
      }).then(res => {
        const blob = new Blob([res.data], { type: 'image/png' })
        const reader = new FileReader()
        reader.onload = e => {
          this.captchaImage = e.target.result
          this.code = res.headers.captchaCode
        }
        reader.readAsDataURL(blob)
      })
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
            captchaCode: this.form.captchaCode,
            code: this.code
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
          }).catch(err => {
            this.getCaptcha()
            console.error(err)
          })
        })
    }
  }

}
