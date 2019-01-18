<template>
  <div class="change-password">
    <div class="password-form">
      <Form ref="formPwd" :model="formPwd" :rules="rulePwd" :label-width="100" label-position="right">
        <FormItem label="原始密码：" prop="oldPassword">
          <Input v-model="formPwd.oldPassword" type="password" placeholder="请输入原始密码" class="inputClassSty"></Input>
        </FormItem>
        <FormItem label="新密码：" prop="password">
          <Input v-model="formPwd.password" type="password" placeholder="请输入新密码" class="inputClassSty"></Input>
        </FormItem>
        <FormItem label="确认密码：" prop="confirmPassword">
          <Input v-model="formPwd.confirmPassword" type="password" placeholder="请再次输入新密码" class="inputClassSty"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" style="width:86px;" @click="pwdSubmit('formPwd')">保存</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
/**
 * 设置-修改密码
 */
import { PSW_RIGHT, CHECK_PWD, CHECK_PWD_SAME } from '../util/validator.js'
import Server from '@/libs/js/server'
import md5 from 'md5'
export default {
  name: 'change-password',
  components: {
  },
  data () {
    return {
      // 密码
      formPwd: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      // 校验相关
      // 密码
      rulePwd: {
        oldPassword: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
          { validator: PSW_RIGHT, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: CHECK_PWD, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: CHECK_PWD_SAME, trigger: 'blur', vm: this }
        ]
      }
    }
  },
  methods: {
    // 密码
    pwdSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formPwd.oldPassword === this.formPwd.password) {
            this.$Message.info('您还未变更任何信息，无需保存')
            return
          }
          Server({
            url: 'set/updatePsw',
            method: 'post',
            data: {
              oldPassword: md5(this.formPwd.oldPassword),
              password: md5(this.formPwd.password),
              confirmPassword: md5(this.formPwd.confirmPassword)
            }
            // data: this.formPwd
          }).then(({ data }) => {
            this.$Message.success('保存成功!')
            this.formPwd = {}
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.change-password
  .password-form
    margin: 0 auto;
    width: 450px;
  .inputClassSty
    width:300px;
</style>
