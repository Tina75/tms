<template>
  <div class="login-con" @keydown.enter="handleSubmit">
    <Card :bordered="false">
      <p slot="title">
        <Icon type="log-in"/>
        欢迎注册
      </p>
      <div class="form-con">
        <Form ref="loginForm" :model="form" :rules="rules">
          <FormItem prop="companyName">
            <Input v-model="form.companyName" placeholder="请输入公司名">
            <Icon slot="prefix" type="ios-contact" />
            </Input>
          </FormItem>
          <FormItem prop="location">
            <Input v-model="form.location" placeholder="请输入所在省市区">
            <Icon slot="prefix" type="ios-contact" />
            </Input>
          </FormItem>
          <FormItem prop="companyAddress">
            <Input v-model="form.companyAddress" placeholder="请输入公司地址">
            <Icon slot="prefix" type="ios-contact" />
            </Input>
          </FormItem>
          <FormItem prop="telephone">
            <Input v-model="form.telephone" placeholder="请输入手机号">
            <Icon slot="prefix" type="ios-contact" />
            </Input>
          </FormItem>
          <FormItem prop="telCaptcha">
            <Row>
              <Col :span="13">
              <Input v-model="form.telCaptcha" type="text" placeholder="请输入验证码">
              <Icon slot="prefix" type="ios-chatbubbles" />
                </Input>
              </Col>
              <Col :span="9" :offset="1">
              <Button  :disabled="!captchaEnable">{{captchaEnable?`&nbsp;&nbsp;&nbsp;获取验证码&nbsp;&nbsp;&nbsp;`:intervalSeconds+'秒后可重试'}}</Button>
                <!-- <Button :size="buttonSize" >90s后重新获取</Button> -->
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <i-button type="primary" long>注册</i-button>
          </FormItem>
          <FormItem style="text-align: right;">
            <router-link to="/" style="margin-right: 20px;">用户登录</router-link>
            <router-link to="/login/find-back">忘记密码</router-link>
          </FormItem>
        </Form>
        <p class="login-tip">运达达运输管理系统</p>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  metaInfo: {
    title: '注册'
  },
  data () {
    return {
      captchaEnable: true,
      timer: null,
      intervalSeconds: 90,
      form: {
        companyName: '',
        companyAddress: '',
        location: '',
        telephone: '',
        imgCaptcha: '',
        telCaptcha: '',
        password: '',
        ensurePassword: ''
      },
      rules: {
        companyName: [
          { required: true, message: '公司名不能为空', trigger: 'blur' },
          { max: 25, trigger: 'blur', message: '公司名不能超过25个字' }
        ],
        location: [
          { required: true, message: '省市区不能为空', trigger: 'blur' }
        ],
        companyAddress: [
          { required: true, message: '公司地址不能为空', trigger: 'blur' },
          { max: 40, min: 5, trigger: 'blur', message: '公司地址不能少于5个字也不能超过40个字' }
        ],
        telephone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { max: 11, min: 11, trigger: 'blur', message: '手机号格式不正确，请重输' }
        ],
        telCaptcha: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { max: 6, min: 6, trigger: 'blur', message: '验证码格式有误' }
        ],
        imgCaptcha: [
          { required: true, message: '图形验证码不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        ensurePassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }
        ]
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
    }
  }
}
</script>
