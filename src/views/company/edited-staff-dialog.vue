<template>
  <div class="dialog">
    <Modal v-model="visiable" :mask-closable="false" transfer width="400" @on-visible-change="close">
      <p slot="header" class="ModalTitle">
        <span>{{title}}</span>
      </p>
      <Form ref="formModal" :model="formModal" :rules="rulesModal" :label-width="100" label-position="left" class="formModal">
        <FormItem label="员工姓名：" prop="name">
          <Input v-model="formModal.name" placeholder="请输入员工姓名" class="inputClass"></Input>
        </FormItem>
        <FormItem label="手机号：" prop="phone">
          <Input v-model="formModal.phone" maxlength="11" placeholder="请输入手机号" class="inputClass"></Input>
        </FormItem>
        <FormItem label="角色：" prop="roleId">
          <Select v-model="formModal.roleId" transfer clearable class="inputClass">
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
      }
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
        for (let index = 0; index < data.data.length; index++) {
          if (data.data[index].type === 1) {
            data.data.splice(index, 1)
          }
        }
        this.selectList = Object.assign({}, data.data)
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
                this.ok()
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
>>> .ivu-form-item-error-tip
  width: 370px;
.dialog
  p
    text-align center
.ModalTitle
  text-align:center;
  font-size: 16px;
  font-weight: bold;
.formModal
  padding: 15px 25px;
  height: 185px;
.inputClass
  width: 200px;
</style>
