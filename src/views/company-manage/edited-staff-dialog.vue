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
              :value="item.name"
              :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  type="primary"  @click="save">确定</Button>
        <Button  type="default"  @click="close">取消</Button>
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
    return {
      formModal: {
        name: '',
        phone: '',
        roleId: ''
      },
      selectList: [{
        name: '全部',
        id: '1'
      }, {
        name: '管理员',
        id: '2'
      }, {
        name: '录入员',
        id: '3'
      }],
      rulesModal: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
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
  },
  methods: {
    save () {
      this.$refs['formModal'].validate((valid) => {
        if (valid) {
          if (this.title === '添加员工') {
            Server({
              url: 'employee/add',
              method: 'post',
              data: this.formModal
            }).then(({ data }) => {
              console.log(data)
            })
          } else {
            Server({
              url: 'employee/update',
              method: 'post',
              data: this.formModal
            }).then(({ data }) => {
              console.log(data)
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
