<template>
  <Modal
    v-model="visiable"
    :mask-closable="false"
    label-position="left"
    class="modal"
    @on-visible-change="close"
  >
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122">
      <FormItem label="发货方名称:" prop="name">
        <Input v-model="validate.name" :maxlength="20" placeholder="请输入"/>
      </FormItem>
      <FormItem label="发货方联系人:" prop="contact">
        <Input v-model="validate.contact" :maxlength="15" placeholder="请输入"/>
      </FormItem>
      <FormItem label="联系电话:" prop="phone">
        <Input v-model="validate.phone" :maxlength="11" placeholder="请输入"/>
      </FormItem>
      <FormItem class="ivu-form-item-required blank" label="支付方式:" >
        <Select v-model="validate.payType" clearable placeholder="请输入">
          <Option value="1">现付</Option>
          <Option value="2">到付</Option>
          <Option value="3">回单付</Option>
          <Option value="4">月结</Option>
        </Select>
      </FormItem>
      <FormItem class="ivu-form-item-required blank" label="备注:" >
        <Input v-model="validate.remark" :maxlength="100" :autosize="{minRows: 2,maxRows: 5}" type="textarea"  placeholder="请输入"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="save('validate')">确定</Button>
      <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
    </div>
  </Modal>
</template>

<script>
import { consignerAdd, consignerUpdate, CODE } from '../client'
import BaseDialog from '@/basic/BaseDialog'
export default {
  name: 'sender',
  mixins: [BaseDialog],
  data () {
    return {
      id: '',
      validate: {
        name: '',
        contact: '',
        phone: '',
        payType: '',
        remark: ''
      },
      ruleValidate: {
        name: [
          { required: true, type: 'string', message: '发货方名称不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, type: 'string', message: '发货方联系人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { type: 'string', message: '电话号码格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flag === 1) { // 新增
            this._consignerAdd()
          } else { // 2-编辑
            this._consignerUpdate()
          }
        }
      })
    },
    _consignerAdd () {
      consignerAdd(this.validate).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
          this.openTab({
            path: '/client/sender-info',
            title: '发货方详情',
            query: { id: res.data.data }
          })
          this.close()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    _consignerUpdate () {
      Object.assign(this.validate, { id: this.id })
      consignerUpdate(this.validate).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
          this.close()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../client.styl"
</style>
