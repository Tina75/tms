<template>
  <div class="dialog">
    <Modal v-model="visiable" :mask-closable="false" transfer width="400" @on-visible-change="close">
      <p slot="header" class="ModalTitle">
        <span>{{title}}</span>
      </p>
      <Form ref="formModal" :model="formModal" :rules="rulesModal">
        <p><span class="formTitle">当前手机号：</span><span class="formContent">{{configPhone(phone)}}</span></p>
        <p><span class="formTitle">更换手机号之后，下次可使用新手机号登录</span></p>
        <FormItem prop="phone" class="formBody">
          <Input v-model="formModal.phone" :maxlength="11" placeholder="请输入新手机号"></Input>
        </FormItem>
        <FormItem prop="code">
          <Row>
            <Col :span="15">
            <Input v-model="formModal.code" :maxlength="6" placeholder="请输入验证码"></Input>
            </Col>
            <Col :span="8" :offset="1">
            <Button :disabled="disabled" type="default" long @click="getCode">{{codeMsg}}</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save">确定</Button>
        <Button type="default" @click="close">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
// import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'update-phone',
  mixins: [BaseDialog],
  data () {
    let vm = this
    var checkPhone = function (rule, value, callback) {
      if (value) {
        if (!(/^1\d{10}$/.test(value))) {
          return callback(new Error('手机号格式不正确'))
        }
        if (vm.phone === value) {
          return callback(new Error('输入的手机号与当前手机号一致'))
        }
        callback()
      } else {
        callback()
      }
    }
    var checkCode = function (rule, value, callback) {
      if (value) {
        if (value === '123456') {
          return callback(new Error('验证码不正确'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      formModal: {
        phone: ''
      },
      rulesModal: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ]
      },
      disabled: false,
      codeMsg: '获取验证码'
    }
  },
  mounted: function () {
  },
  methods: {
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
          let count = 6
          vm.disabled = true
          let interval = setInterval(() => {
            if (count === 1) {
              vm.disabled = false
              vm.codeMsg = '获取验证码'
              clearInterval(interval)
            } else {
              vm.codeMsg = --count + '秒后可重试'
            }
          }, 1000)
        }
      })
    },
    save () {
      this.$refs['formModal'].validate((valid) => {
        if (valid) {
          this.$Message.success('账号更改成功')
          this.close()
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
