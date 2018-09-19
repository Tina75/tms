<template>
  <div class="dialog">
    <Modal v-model="visibale" :mask-closable="false" width="360">
      <p slot="header" style="text-align:center">
        <span>{{title}}</span>
      </p>
      <Form ref="formModal" :model="formModal" :rules="rulesModal" :label-width="120" label-position="left" style="height: 200px;">
        <FormItem label="员工姓名：" prop="name">
          <Input v-model="formModal.name" placeholder="请输入员工姓名"></Input>
        </FormItem>
        <FormItem label="手机号：" prop="phone">
          <Input v-model="formModal.phone" placeholder="请输入员工姓名"></Input>
        </FormItem>
        <FormItem label="角色：" prop="roleId">
          <Select v-model="formModal.roleId" clearable>
            <Option
              v-for="item in selectList"
              :value="item.id"
              :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary"  @click="save">确定</Button>
        <Button type="default"  @click="close">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="successModal"
      width="360">
      <p slot="header" style="text-align:center">
        <span>提示</span>
      </p>
      <P>添加员工成功，员工的登录账号为手机号</P>
      <P>初始登录密码已发送至员工手机</P>
      <div slot="footer">
        <Button type="primary" @click="close">我知道了</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Server from '@/libs/js/server'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'editUser',
  mixins: [BaseDialog],
  data () {
    var checkName = function (rule, value, callback) {
      if (value.length < 2 || value.length > 10) {
        return callback(new Error('姓名不能小于2个字且不能多于10个字'))
      } else {
        callback()
      }
    }
    var checkPhone = function (rule, value, callback) {
      if (value) {
        if (!(/^1\d{10}$/.test(value))) {
          return callback(new Error('手机号格式不正确'))
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      successModal: false,
      formModal: {
        name: '',
        phone: '',
        roleId: ''
      },
      selectList: [],
      rulesModal: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色' }
        ]
      },
      visibale: true
    }
  },
  watch: {
    visibale: function (val) {
      !val && this.close()
    }
  },
  mounted: function () {
    this.formModal = Object.assign({}, this.formData)
    this.getRoleSelectList()
  },
  methods: {
    getRoleSelectList () {
      Server({
        url: 'role/list',
        method: 'get'
      }).then(({ data }) => {
        this.selectList = data.data
      })
    },
    save () {
      this.$refs['formModal'].validate((valid) => {
        if (valid) {
          if (this.title === '添加员工') {
            Server({
              url: 'employee/add',
              method: 'post',
              data: this.formModal
            }).then(({ data }) => {
              if (data.code === 10000) {
                this.$Message.success('添加成功!')
                this.close()
                this.successModal = true
                this.ok()
              } else {
                this.$Message.success(data.msg)
              }
            })
          } else {
            Server({
              url: 'employee/update',
              method: 'post',
              data: this.formModal
            }).then(({ data }) => {
              if (data.code === 10000) {
                this.$Message.success('修改成功!')
                this.close()
                this.ok()
              } else {
                this.$Message.success(data.msg)
              }
            })
          }
        }
      })
    }
  }

}

</script>
<style lang='stylus' scoped>
.dialog
  p
    text-align center
</style>
