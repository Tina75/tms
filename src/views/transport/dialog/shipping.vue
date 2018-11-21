<template>
  <Modal v-model="visiable" :mask-closable="false" transfer width="350" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{ title }}</p>
    <p>
      <i class="icon font_family icon-bangzhuzhongxin"></i>
    </p><p class="titleP">是否发运？发运以后将不能再修改外转单信息</p>
    </p><br/>
    <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="80" label-position="right">
      <FormItem label="车牌号:" prop="carNo">
        <Input v-model="validate.carNo" :maxlength="8" @on-change="inputChange"></Input>
      </FormItem>
      <FormItem label="司机姓名:">
        <Input v-model="validate.driverName" :maxlength="20" @on-change="inputChange" ></Input>
      </FormItem>
      <FormItem label="手机号:" prop="driverPhone">
        <Input v-model="validate.driverPhone" :maxlength="11" @on-change="inputChange" ></Input>
      </FormItem>
    </Form>
    <p v-if="isShow" class="titleP" style="color:#EC4E4E">选中的外转单将都会绑定以上填写的车辆及司机信息</p>
    <div slot="footer" style="text-align: center;">
      <Button type="primary"  @click="ok('validate')">确定</Button>
      <Button type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import { CAR } from '../client'
import Server from '@/libs/js/server'
export default {
  name: 'Confirm',
  mixins: [ BaseDialog ],
  data () {
    return {
      isShow: false,
      validate: {
        carNo: '',
        driverPhone: '',
        driverName: ''
      },
      transIds: '',
      ruleValidate: {
        carNo: [
          { type: 'string', message: '车牌号格式错误', pattern: CAR }
        ],
        driverPhone: [
          { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/ }
        ]
      }
    }
  },
  methods: {
    ok (name) {
      this.$refs[name].validate((valid) => {
        let this_ = this
        if (valid) {
          let params = {}
          params.transIds = this.transIds
          params.carNo = this.validate.carNo
          params.driverPhone = this.validate.driverPhone
          params.driverName = this.validate.driverName
          Server({
            url: '/outside/bill/send',
            method: 'post',
            data: params
          }).then(res => {
            this_.$Message.success('操作成功')
            this_.confirm()
            this_.close()
          }).then(res => {
          })
        }
      })
    },
    inputChange () {
      if (this.transIds.length > 1 && (this.validate.carNo.length > 0 || this.validate.driverName.length > 0 || this.validate.driverPhone.length > 0)) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    }
  }
}

</script>
<style lang='stylus' scoped>
.icon-bangzhuzhongxin
  font-size:28px
  background: white
  color: #FF9502
  width:40px
  float left
.titleP
  line-height: 45px
  color: #000000
  font-size:12px
  font-weight:400
</style>
