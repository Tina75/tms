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
        <FormItem label="司机类型:" prop="driverType">
          <Select v-model="validate.driverType" placeholder="请输入">
            <Option value= "1">合约司机</Option>
            <Option value= "2">临时司机</Option>
          </Select>
        </FormItem>
        <FormItem label="姓名:" prop="driverName">
          <Input v-model="validate.driverName" :maxlength="15" placeholder="请输入"/>
        </FormItem>
        <FormItem label="手机号码:" prop="driverPhone">
          <Input v-model="validate.driverPhone"  placeholder="请输入"/>
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
import { carrierAddDriver, carrierUpdateDriver, CODE } from '../client'
export default {
  name: 'carrier-driver',
  mixins: [BaseDialog],
  data () {
    return {
      modal: true,
      id: '',
      validate: {
        driverType: '1',
        driverName: '',
        driverPhone: ''
      },
      ruleValidate: {
        driverType: [
          { required: true, message: '司机类型不能为空', trigger: 'blur' }
        ],
        driverName: [
          { required: true, message: '司机姓名不能为空', trigger: 'blur' }
        ],
        driverPhone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/, trigger: 'blur' }]
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
        carrierId: this.id,
        driverType: this.validate.driverType,
        driverName: this.validate.driverName,
        driverPhone: this.validate.driverPhone
      }
      carrierAddDriver(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    update () {
      let data = {
        driverId: this.id,
        driverType: this.validate.driverType,
        driverName: this.validate.driverName,
        driverPhone: this.validate.driverPhone
      }
      carrierUpdateDriver(data).then(res => {
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
