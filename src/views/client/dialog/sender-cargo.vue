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
        <FormItem label="货物名称:" prop="cargoName">
          <Input v-model="validate.cargoName" :maxlength="20" placeholder="请输入"/>
        </FormItem>
        <FormItem label="包装单位:">
          <Input v-model="validate.unit" :maxlength="10" placeholder="请输入"/>
        </FormItem>
        <FormItem label="货值:" prop="cargoCost">
          <Input v-model="validate.cargoCost" :maxlength="60" placeholder="请输入"/>
        </FormItem>
        <FormItem label="重量:" prop="weight">
          <Input v-model="validate.weight" :maxlength="60" placeholder="请输入"/>吨
        </FormItem>
        <FormItem label="体积:" prop="volume">
          <Input v-model="validate.volume" :maxlength="60" placeholder="请输入"/>万
        </FormItem>
        <FormItem label="备注:" >
          <Input v-model="validate.remark" :maxlength="100" placeholder="请输入"/>
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
import { consignerCargoAdd, consignerCargoUpdate, CODE } from '../client'
export default {
  name: 'sender-address',
  mixins: [BaseDialog],
  data () {
    return {
      modal: true,
      consignerId: '', // 详情传过来的id
      id: '',
      validate: {
        cargoName: '',
        unit: '',
        cargoCost: '',
        weight: '',
        volume: '',
        remark: ''
      },
      ruleValidate: {
        cargoName: [
          { required: true, message: '货物名称不能为空', trigger: 'blur' }
        ],
        cargoCost: [
          { type: 'string', message: '必须为大于0的数,且精确到两位小数', pattern: /^(\+)?\d+(\.\d{1,2})?$/, trigger: 'blur' }
        ],
        weight: [
          { type: 'string', message: '必须为大于0的数,且精确到两位小数', pattern: /^(\+)?\d+(\.\d{1,2})?$/, trigger: 'blur' }
        ],
        volume: [
          { type: 'string', message: '必须为大于0的数,且精确到一位小数', pattern: /^(\+)?\d+(\.\d)?$/, trigger: 'blur' }
        ]
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
        cargoName: this.validate.cargoName,
        unit: this.validate.unit,
        cargoCost: Math.floor(this.validate.cargoCost * 100) / 100,
        weight: Math.floor(this.validate.weight * 100) / 100,
        volume: Math.floor(this.validate.volume * 10) / 10,
        remark: this.validate.remark
      }
      consignerCargoAdd(data).then(res => {
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
        cargoName: this.validate.cargoName,
        unit: this.validate.unit,
        cargoCost: Math.floor(this.validate.cargoCost * 100) / 100,
        weight: Math.floor(this.validate.weight * 100) / 100,
        volume: Math.floor(this.validate.volume * 10) / 10,
        remark: this.validate.remark
      }
      consignerCargoUpdate(data).then(res => {
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
  .ivu-input-wrapper
    width: 86%
    margin-right 8px
</style>
