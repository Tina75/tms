<!--承运商详情----车辆新增编辑-->
<template>
  <div>
    <Modal
      v-model="visiable"
      :mask-closable="false"
      label-position="left"
      class="modal"
      @on-visible-change="close"
    >
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="validate" :model="validate" :rules="ruleValidate" :label-width="122">
        <FormItem label="车牌号:" prop="carNO">
          <Input v-model="validate.carNO" :maxlength="15" placeholder="请输入"/>
        </FormItem>
        <FormItem label="车型:" prop="carType">
          <Select v-model="validate.carType" >
            <Option v-for="(item, key) in carTypeMap" :key="key" :value="key">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem label="车长:" prop="carLength">
          <Select v-model="validate.carLength" >
            <Option v-for="(item, key) in carLengthMap" :key="key" :value="''+item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="核定载重量:" prop="shippingWeight">
          <Input v-model="validate.shippingWeight"  placeholder="请输入"/>吨
        </FormItem>
        <FormItem label="车载容积:" prop="shippingVolume" class="ivu-form-item-required blank">
          <Input v-model="validate.shippingVolume"  placeholder="请输入"/>方
        </FormItem>
        <FormItem label="主司机:" class="ivu-form-item-required blank">
          <Select v-model="driverId" >
            <Option v-for="(item,index) in unbindedDriver" :key="index"  :value= "item.driverId">{{item.driverName}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="save('validate')">确定</Button>
        <Button style="margin-left: 8px" @click.native="close"  >取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { CAR_TYPE1, CAR_LENGTH } from '@/libs/constant/carInfo'
import BaseDialog from '@/basic/BaseDialog'
import { carrierAddVehicle, carrierUpdateVehicle, listUnbindedDriver, CODE, CAR } from '../client'
export default {
  name: 'carrier-vehicle',
  mixins: [BaseDialog],
  data () {
    return {
      carTypeMap: CAR_TYPE1,
      carLengthMap: CAR_LENGTH,
      carrierId: '', // 承运商id
      driverId: 0, // 司机id
      driverName: '', // 只有编辑需要的数据
      carId: '', // 车辆id
      unbindedDriver: [], // 承运商下尚未被绑定车辆的司机
      validate: {
        carNO: '',
        carType: '',
        shippingWeight: '',
        carLength: '',
        shippingVolume: ''
      },
      ruleValidate: {
        carNO: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' },
          { type: 'string', message: '车牌号格式错误', pattern: CAR, trigger: 'blur' }
        ],
        carType: [
          { required: true, message: '车型不能为空', trigger: 'change' }
        ],
        shippingWeight: [
          { required: true, message: '载重量不能为空', trigger: 'blur' },
          { type: 'string', message: '必须为大于等于0的数字,最多两位小数', pattern: /^(0|([1-9]\d*))([.]\d{1,2})?$/, trigger: 'blur' }
        ],
        carLength: [
          { required: true, message: '车长不能为空', trigger: 'change' }
        ],
        shippingVolume: [
          { type: 'string', message: '必须为大于等于0的数字,最多一位小数', pattern: /^(0|([1-9]\d*))([.]\d?)?$/, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let data = {
      carrierId: this.carrierId,
      driverId: this.driverId
    }
    listUnbindedDriver(data).then(res => {
      if (res.data.code === CODE) {
        this.unbindedDriver = res.data.data
        this.unbindedDriver.unshift({ driverId: '', driverName: '请选择' })
      }
    })
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
          this.close()
        }
      })
    },
    add () {
      let data = {
        carNO: this.validate.carNO,
        carType: this.validate.carType,
        shippingWeight: this.validate.shippingWeight,
        carLength: this.validate.carLength,
        shippingVolume: this.validate.shippingVolume,
        driverId: this.driverId,
        carrierId: this.carrierId
      }
      Object.assign(data, { driverId: this.driverId || '' })
      carrierAddVehicle(data).then(res => {
        if (res.data.code === CODE) {
          this.ok() // 刷新页面
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    update () {
      let data = {
        carNO: this.validate.carNO,
        carType: this.validate.carType,
        shippingWeight: this.validate.shippingWeight,
        carLength: this.validate.carLength,
        shippingVolume: this.validate.shippingVolume,
        driverId: this.driverId,
        carrierId: this.carrierId,
        carId: this.carId
      }
      Object.assign(data, { driverId: this.driverId || '' })
      carrierUpdateVehicle(data).then(res => {
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
  @import "../client.styl"
  .ivu-input-wrapper,.ivu-select
    width: 86%
    margin-right 8px
</style>
