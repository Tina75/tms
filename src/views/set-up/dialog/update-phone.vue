<template>
  <div class="dialog">
    <Modal v-model="visiable" :mask-closable="false" transfer width="400" @on-visible-change="close">
      <p slot="header" class="ModalTitle">
        <span>{{title}}</span>
      </p>
      <Form v-show="step === 1" ref="formPwd" :model="formPwd" :rules="rulesformPwd">
        <p><span class="formTitle">当前手机号：</span><span class="formContent">{{configPhone(phone)}}</span></p>
        <p><span class="formTitle">修改前，请先输入账号密码，以验证身份</span></p>
        <FormItem prop="password" class="formBody">
          <Input v-model="formPwd.password" type="password" placeholder="请输入当前账号密码"></Input>
        </FormItem>
      </Form>
      <Form v-show="step === 2" ref="formModal" :model="formModal" :rules="rulesModal">
        <p><span class="formTitle">当前手机号：</span><span class="formContent">{{configPhone(phone)}}</span></p>
        <p><span class="formTitle">更换手机号之后，下次可使用新手机号登录</span></p>
        <FormItem prop="phone" class="formBody">
          <Input v-model="formModal.phone" :maxlength="11" placeholder="请输入新手机号"></Input>
        </FormItem>
        <FormItem prop="smsCode">
          <Row>
            <Col :span="15">
            <Input v-model="formModal.smsCode" :maxlength="6" placeholder="请输入验证码"></Input>
            </Col>
            <Col :span="8" :offset="1">
            <Button :disabled="disabled" type="default" long @click="getCode">{{codeMsg}}</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div v-if="step === 1" slot="footer">
        <Button type="primary" @click="next">下一步</Button>
        <Button type="default" @click="close">取消</Button>
      </div>
      <div v-else slot="footer">
        <Button type="primary" @click="save">提交</Button>
        <Button type="default" @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
import { setToken, removeToken } from '@/libs/js/auth'
import { mapMutations } from 'vuex'
import { PSW_RIGHT } from '../pages/validator'
export default {
  name: 'update-phone',
  mixins: [BaseDialog],
  data () {
    let vm = this
    var checkPhone = function (rule, value, callback) {
      if (value) {
        if (!(/^1\d{10}$/.test(value))) {
          return callback(new Error('手机号格式不正确，请重输'))
        }
        if (vm.phone === value) {
          return callback(new Error('新手机号不能与当前手机号一致'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      step: 1,
      formModal: {
        phone: '',
        smsCode: ''
      },
      formPwd: {
        password: ''
      },
      rulesformPwd: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: PSW_RIGHT, trigger: 'blur' }
        ]
      },
      rulesModal: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        smsCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      disabled: false,
      codeMsg: '获取验证码'
    }
  },
  mounted: function () {
  },
  methods: {
    ...mapMutations(['initUserInfo']),
    configPhone (phoneNumber) {
      if (phoneNumber.length === 11) {
        let phone = phoneNumber.toString()
        return phone.substring(0, 3) + ' ' + phone.substring(3, 7) + ' ' + phone.substring(7, 11)
      }
    },
    getCode () {
      let vm = this
      this.$refs.formModal.validateField('phone', callback => {
        if (!callback) {
          let count = 90
          Server({
            url: '/set/phoneSms',
            method: 'get',
            data: { phone: vm.formModal.phone }
          }).then(() => {
            vm.disabled = true
            vm.$Message.success('短信验证码已发送至手机，请注意查收')
            let interval = setInterval(() => {
              if (count === 1) {
                vm.disabled = false
                vm.codeMsg = '获取验证码'
                clearInterval(interval)
              } else {
                vm.codeMsg = --count + '秒后可重试'
              }
            }, 1000)
          })
        }
      })
    },
    next () {
      this.$refs['formPwd'].validate((valid) => {
        if (valid) {
          this.step = 2
        }
      })
    },
    save () {
      let vm = this
      this.$refs['formModal'].validate((valid) => {
        if (valid) {
          let param = {}
          param.phone = vm.formModal.phone
          param.smsCode = vm.formModal.smsCode
          param.password = vm.formPwd.password
          Server({
            url: '/set/userPhone',
            method: 'post',
            data: param
          }).then(({ data }) => {
            this.$Message.success('号码修改成功')
            vm.person.phone = vm.formModal.phone
            vm.initUserInfo(vm.person)
            removeToken()
            setToken(data.data)
            vm.ok()
            vm.close()
          })
        }
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.ModalTitle
  text-align:center
  font-size: 16px;
  font-weight: bold
  color: #2F323E
.formTitle
  color #333333
  font-size 14px
  line-height:28px;
.formContent
  color #333333
  font-size 20px
  margin-left 10px
.formBody
  margin-top 25px
</style>
