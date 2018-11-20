<template>
  <Modal
    v-model="visiable"
    :mask-closable="false"
    transfer
    label-position="left"
    class="modal"
    @on-visible-change="close"
  >
    <p slot="header" style="text-align:center">{{title}}</p>
    <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122">
      <FormItem label="外转方名称：" prop="name">
        <Input v-model="validate.name" :maxlength="20" placeholder="请输入"/>
      </FormItem>
      <FormItem label="联系人：" prop="contact">
        <Input v-model="validate.contact" :maxlength="15" placeholder="请输入"/>
      </FormItem>
      <FormItem label="联系电话：" prop="phone">
        <Input v-model="validate.phone" :maxlength="11" placeholder="请输入"/>
      </FormItem>
      <FormItem label="公司地址：" prop="companyAddress">
        <AreaInput v-model="validate.companyAddress" :maxlength="60" placeholder="请输入" @latlongt-change="latlongtChange"/>
      </FormItem>
      <FormItem label="支付方式：" class="ivu-form-item-required blank">
        <Select v-model="validate.payType" placeholder="请输入" transfer clearable>
          <Option value="1">现付</Option>
          <Option value="2">到付</Option>
          <Option value="3">回单付</Option>
          <Option value="4">月结</Option>
        </Select>
      </FormItem>
      <FormItem label="备注：" class="ivu-form-item-required blank">
        <Input v-model="validate.remark" :autosize="{minRows: 2,maxRows: 5}" :maxlength="100"  type="textarea"  placeholder="请输入"/>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="save('validate')">确定</Button>
      <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
    </div>
  </Modal>
</template>

<script>
import { transfereeAdd, transfereeUpdate, CODE } from '../client'
import BaseDialog from '@/basic/BaseDialog'
import AreaInput from '@/components/AreaInput.vue'
export default {
  name: 'transfer',
  components: {
    AreaInput
  },
  mixins: [BaseDialog],
  data () {
    return {
      modaladd: true,
      id: '',
      validate: {
        name: '',
        contact: '',
        phone: '',
        companyAddress: '',
        payType: '',
        remark: '',
        longitude: '',
        latitude: '',
        mapType: 1
      },
      ruleValidate: {
        name: [
          { required: true, message: '外转方名称不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { type: 'string', message: '电话号码格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }
        ],
        companyAddress: [
          { required: true, message: '公司地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    save (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.flag === 1) { // 新增
            this._transfereeAdd()
          } else { // 2-编辑
            this._transfereeUpdate()
          }
        }
      })
    },
    _transfereeAdd () {
      transfereeAdd(this.validate).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
          this.close()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    _transfereeUpdate () {
      Object.assign(this.validate, { id: this.id })
      transfereeUpdate(this.validate).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
          this.close()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    latlongtChange ({ lat, lng }) {
      this.validate.latitude = lat
      this.validate.longitude = lng
      this.validate.mapType = 1
    }
  }
}
</script>

<style scoped lang="stylus">
 @import "../client.styl"
</style>
