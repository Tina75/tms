<template>
  <Modal v-model="visiable" :mask-closable="false" width="350" @on-visible-change="close">
    <p slot="header" style="text-align:center">{{ title }}</p>
    <p>是否发运？发运以后不可以修改外传单信息</p>
    <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="90">
      <FormItem label="车牌号:" prop="carNO">
        <Input v-model="validate.carNO" :maxlength="8" placeholder="必填"></Input>
      </FormItem>
      <FormItem label="司机姓名:">
        <Input v-model="validate.driverName" :maxlength="20" placeholder="必填"></Input>
      </FormItem>
      <FormItem label="手机号:" prop="driverPhone">
        <Input v-model="validate.driverPhone" :maxlength="11" placeholder="必填"></Input>
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button  type="primary"  @click="ok">确定</Button>
      <Button  type="default"  @click.native="close">取消</Button>
    </div>
  </Modal>
</template>

<script>
import BaseDialog from '@/basic/BaseDialog'
import { CAR } from '../client'
export default {
  name: 'Confirm',
  mixins: [ BaseDialog ],
  data () {
    return {
      validate: {},
      ruleValidate: {
        carNO: [
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        driverName: [
          { required: true, message: '司机姓名不能为空', trigger: 'blur' }
        ],
        driverPhone: [
          { type: 'string', message: '手机号码格式错误', pattern: /^1\d{10}$/ }
        ]
      }
    }
  },
  methods: {
    ok () {
      this.confirm()
      this.close()
    }
  }
}

</script>
<style lang='stylus' scoped>
</style>
