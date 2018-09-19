<!--发货方详情地址新增编辑-->
<template>
  <div>
    <Modal
      v-model="modal"
      :mask-closable="true"
      label-position="left"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122">
        <FormItem label="收货联系人:" prop="contact">
          <Input v-model="validate.contact" :maxlength="15" placeholder="请输入"/>
        </FormItem>
        <FormItem label="联系电话:" prop="phone">
          <Input v-model="validate.phone" :maxlength="11" placeholder="请输入"/>
        </FormItem>
        <FormItem label="收货地址:" prop="address">
          <Input v-model="validate.address" :maxlength="60" placeholder="请输入"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="modal = false"  >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import { consignerConsigneeAdd, consignerConsigneeUpdate, CODE } from '../client'
export default {
  name: 'sender-address',
  mixins: [BaseDialog],
  data () {
    return {
      modal: true,
      consignerId: '', // 详情传过来的id
      id: '',
      validate: {
        contact: '',
        phone: '',
        address: ''
      },
      ruleValidate: {
        contact: [
          { required: true, message: '收货联系人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { type: 'string', message: '电话号码格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '收货地址不能为空', trigger: 'blur' }
        ]
        // remark: [
        //   { required: true, message: '备注不能为空', trigger: 'blur' }
        // ],
      }
    }
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flag === 1) { // 新增
            this.add()
          } else { // 2-编辑
            this.update()
          }
          this.modal = false
        }
      })
    },
    add () {
      let data = {
        consignerId: this.consignerId,
        contact: this.validate.contact,
        phone: this.validate.phone,
        address: this.validate.address
      }
      consignerConsigneeAdd(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    update () {
      let data = {
        id: this.id,
        contact: this.validate.contact,
        phone: this.validate.phone,
        address: this.validate.address
      }
      consignerConsigneeUpdate(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
